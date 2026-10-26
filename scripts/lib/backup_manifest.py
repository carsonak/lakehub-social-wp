#!/usr/bin/env python3
"""Pair each Studio export with its own Git source and observed restore baseline.

No project release, content count or dependency version is baked into this tool.
All checks are read-only except the explicitly requested manifest output.
"""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import sqlite3
import subprocess
import sys
import zipfile
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[2]


def digest(data):
    return hashlib.sha256(data).hexdigest()


def file_digest(path):
    with Path(path).open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def git(*args):
    return subprocess.check_output(['git', '-C', str(ROOT), *args])


def source_files(revision, roots):
    """Read exact committed blobs, including executable modes, without checkout."""
    paths = git('ls-tree', '-rz', revision, '--', *roots).split(b'\0')
    entries = []
    for entry in filter(None, paths):
        info, name = entry.split(b'\t', 1)
        mode, kind, oid = info.decode().split()
        name = name.decode()
        if kind != 'blob' or mode == '120000':
            raise ValueError('Unsupported source entry: ' + name)
        entries.append((name, mode, oid))
    payload = subprocess.check_output(
        ['git', '-C', str(ROOT), 'cat-file', '--batch'],
        input=''.join(oid + '\n' for _, _, oid in entries).encode())
    result = {}
    offset = 0
    for name, mode, _ in entries:
        end = payload.index(b'\n', offset)
        _, kind, size = payload[offset:end].split()
        if kind != b'blob':
            raise ValueError('Expected source blob: ' + name)
        offset = end + 1
        size = int(size)
        result[name] = {'sha256': digest(payload[offset:offset + size]), 'mode': mode}
        offset += size + 1
    if not result:
        raise ValueError('No committed project source found in configured roots')
    return result


def archive_files(archive, roots):
    result = {}
    names = set()
    for item in archive.infolist():
        path = PurePosixPath(item.filename)
        if path.is_absolute() or '..' in path.parts or '\\' in item.filename:
            raise ValueError('Unsafe archive member: ' + item.filename)
        if item.filename in names:
            raise ValueError('Duplicate archive member: ' + item.filename)
        names.add(item.filename)
        if not item.is_dir() and any(item.filename.startswith(root.rstrip('/') + '/') for root in roots):
            result[item.filename] = digest(archive.read(item))
    return result


def compare_files(expected, actual):
    issues = []
    for path, info in expected.items():
        if actual.get(path) != info['sha256']:
            issues.append(('Missing' if path not in actual else 'Changed') + ': ' + path)
    issues.extend('Unexpected: ' + path for path in sorted(actual.keys() - expected.keys()))
    if issues:
        raise ValueError('Project source does not match the backup revision:\n' + '\n'.join(issues[:30]))


def site_snapshot(site):
    """Observe published content and media without booting WP or changing SQLite."""
    database = Path(site) / 'wp-content/database/.ht.sqlite'
    if not database.is_file():
        raise ValueError('Studio SQLite database missing: ' + str(database))
    with sqlite3.connect(database.resolve().as_uri() + '?mode=ro', uri=True) as connection:
        if connection.execute('PRAGMA quick_check').fetchall() != [('ok',)]:
            raise ValueError('SQLite integrity check failed')
        tables = [row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type='table'")]
        option_tables = [name for name in tables if name.endswith('_options')]
        if len(option_tables) != 1:
            raise ValueError('Expected one SQLite site; multisite requires an explicit site-specific snapshot')
        prefix = option_tables[0][:-len('options')]
        if not re.fullmatch(r'[A-Za-z0-9_]+', prefix):
            raise ValueError('Invalid SQLite table prefix')
        options = dict(connection.execute(f'SELECT option_name, option_value FROM {prefix}options WHERE option_name IN ("home","stylesheet","template","active_plugins","page_on_front","show_on_front")'))
        site_url = options.pop('home', '').rstrip('/')
        rows = list(connection.execute(f'SELECT ID,post_type,post_name,post_title,post_content FROM {prefix}posts WHERE post_status="publish" ORDER BY ID'))
        normalized = [[str(value).replace(site_url, '{{SITE_URL}}') if site_url else str(value) for value in row] for row in rows]
        counts = {}
        for row in rows:
            counts[row[1]] = counts.get(row[1], 0) + 1
        media = sorted({row[0] for row in connection.execute(f'SELECT meta_value FROM {prefix}postmeta WHERE meta_key="_wp_attached_file"')})
    missing_media = []
    uploads = (Path(site) / 'wp-content/uploads').resolve()
    for name in media:
        path = (uploads / name).resolve()
        if not path.is_relative_to(uploads) or not path.is_file():
            missing_media.append(name)
    return {'options': options, 'published_counts': counts,
            'published_content_sha256': digest(json.dumps(normalized, ensure_ascii=False).encode()),
            'media_files': media, 'missing_media': missing_media}


def create(archive_path, output):
    roots = json.loads((ROOT / 'scripts/backup-sources.json').read_text())['source_roots']
    if git('status', '--porcelain', '--untracked-files=all', '--', *roots).strip():
        raise ValueError('Commit intended project source before creating the backup manifest')
    revision = git('rev-parse', 'HEAD').decode().strip()
    expected = source_files(revision, roots)
    with zipfile.ZipFile(archive_path) as archive:
        compare_files(expected, archive_files(archive, roots))
        sql = {name: digest(archive.read(name)) for name in archive.namelist() if re.fullmatch(r'sql/[^/]+\.sql', name)}
        if not sql:
            raise ValueError('Studio export has no SQL payload')
        metadata = json.loads(archive.read('meta.json'))
    snapshot = site_snapshot(ROOT)
    if snapshot['missing_media']:
        raise ValueError('Live site has missing original media: ' + ', '.join(snapshot['missing_media'][:10]))
    manifest = {'schema_version': 1, 'created_at': datetime.now(timezone.utc).isoformat(),
                'source_commit': revision, 'source_roots': roots, 'source_files': expected,
                'archive_sha256': file_digest(archive_path), 'sql_sha256': sql,
                'studio_metadata': metadata,
                'observed_site_at_manifest_creation': snapshot}
    Path(output).write_text(json.dumps(manifest, indent=2, sort_keys=True) + '\n')
    print('Source/export match verified; manifest:', output)


def verify(archive_path, manifest_path, checkout=False, site=None):
    manifest = json.loads(Path(manifest_path).read_text())
    if manifest.get('schema_version') != 1:
        raise ValueError('Unsupported backup manifest schema')
    if file_digest(archive_path) != manifest['archive_sha256']:
        raise ValueError('Archive checksum does not match its manifest')
    with zipfile.ZipFile(archive_path) as archive:
        compare_files(manifest['source_files'], archive_files(archive, manifest['source_roots']))
        for name, expected in manifest['sql_sha256'].items():
            if digest(archive.read(name)) != expected:
                raise ValueError('SQL payload checksum mismatch: ' + name)
    if checkout:
        current = {name: file_digest(ROOT / name) for name in manifest['source_files'] if (ROOT / name).is_file()}
        # Compare committed file inventory too, to detect additions since the backup.
        committed = source_files('HEAD', manifest['source_roots'])
        for name in committed.keys() - current.keys():
            if (ROOT / name).is_file():
                current[name] = file_digest(ROOT / name)
        for name in git('ls-files', '--others', '--exclude-standard', '--', *manifest['source_roots']).decode().splitlines():
            current[name] = file_digest(ROOT / name)
        compare_files(manifest['source_files'], current)
    if site:
        actual = site_snapshot(site)
        expected = manifest['observed_site_at_manifest_creation']
        for key in ['options', 'published_counts', 'published_content_sha256', 'media_files']:
            if actual[key] != expected[key]:
                raise ValueError('Restored site differs from recorded baseline: ' + key)
        if actual['missing_media']:
            raise ValueError('Restored originals missing: ' + ', '.join(actual['missing_media'][:10]))
    print('Backup verified. Source revision:', manifest['source_commit'])
    print('Recorded runtime (observations, not pinned requirements):', json.dumps(manifest['studio_metadata'], separators=(',', ':')))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['create', 'verify'])
    parser.add_argument('archive', type=Path)
    parser.add_argument('--manifest', type=Path)
    parser.add_argument('--checkout', action='store_true')
    parser.add_argument('--site', type=Path)
    args = parser.parse_args()
    manifest = args.manifest or Path(str(args.archive) + '.manifest.json')
    try:
        if args.action == 'create':
            create(args.archive, manifest)
        else:
            verify(args.archive, manifest, args.checkout, args.site)
    except (ValueError, KeyError, OSError, zipfile.BadZipFile, subprocess.CalledProcessError) as error:
        print('Backup verification failed:', error, file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
