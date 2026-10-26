"""Regression tests for stale exports and evolving backup baselines."""
import importlib.util
import json
from pathlib import Path
import sqlite3
import subprocess
import tempfile
import unittest
import zipfile

SPEC = importlib.util.spec_from_file_location('backup_manifest', Path(__file__).parents[1] / 'lib/backup_manifest.py')
module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(module)


class BackupManifestTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.original_root = module.ROOT
        module.ROOT = self.root
        (self.root / 'scripts').mkdir()
        (self.root / 'scripts/backup-sources.json').write_text(json.dumps({'source_roots': ['wp-content/themes/example']}))
        self.source = self.root / 'wp-content/themes/example/style.css'
        self.source.parent.mkdir(parents=True)
        self.source.write_text('/* theme v1 */')
        self.git('init', '-q')
        self.git('config', 'user.name', 'Backup Test')
        self.git('config', 'user.email', 'backup-test@example.invalid')
        self.commit()
        db = self.root / 'wp-content/database/.ht.sqlite'
        db.parent.mkdir()
        with sqlite3.connect(db) as c:
            c.executescript('CREATE TABLE test_options(option_name TEXT,option_value TEXT); CREATE TABLE test_posts(ID INTEGER,post_type TEXT,post_name TEXT,post_title TEXT,post_content TEXT,post_status TEXT); CREATE TABLE test_postmeta(meta_key TEXT,meta_value TEXT);')
            c.executemany('INSERT INTO test_options VALUES (?,?)', [('home', 'http://before.test'), ('stylesheet', 'example')])
            c.execute('INSERT INTO test_posts VALUES (1,"page","home","Home","http://before.test/image.png","publish")')
        (self.root / 'wp-content/uploads').mkdir()
        self.archive = self.root / 'backup.zip'
        self.manifest = self.root / 'backup.zip.manifest.json'

    def tearDown(self):
        module.ROOT = self.original_root
        self.temp.cleanup()

    def git(self, *args):
        subprocess.run(['git', '-C', str(self.root), *args], check=True, stdout=subprocess.DEVNULL)

    def commit(self):
        self.git('add', 'scripts', 'wp-content/themes')
        self.git('commit', '-qm', 'test: source checkpoint')

    def export(self, content=None):
        with zipfile.ZipFile(self.archive, 'w') as archive:
            archive.writestr('wp-content/themes/example/style.css', self.source.read_bytes() if content is None else content)
            archive.writestr('sql/export.sql', '-- independent database payload')
            archive.writestr('meta.json', json.dumps({'wordpressVersion': 'future-release', 'phpVersion': 'future-runtime'}))

    def test_future_revision_and_versions_get_new_baseline(self):
        self.export()
        module.create(self.archive, self.manifest)
        first = json.loads(self.manifest.read_text())['source_commit']
        module.verify(self.archive, self.manifest, True, self.root)
        self.source.write_text('/* future source */')
        self.commit()
        self.export()
        module.create(self.archive, self.manifest)
        self.assertNotEqual(first, json.loads(self.manifest.read_text())['source_commit'])
        module.verify(self.archive, self.manifest, True, self.root)

    def test_stale_export_rejected(self):
        self.export(content='old or truncated source')
        with self.assertRaisesRegex(ValueError, 'does not match'):
            module.create(self.archive, self.manifest)

    def test_dirty_source_rejected(self):
        self.source.write_text('uncommitted')
        self.export()
        with self.assertRaisesRegex(ValueError, 'Commit intended'):
            module.create(self.archive, self.manifest)

    def test_wrong_pair_rejected(self):
        self.export()
        module.create(self.archive, self.manifest)
        with zipfile.ZipFile(self.archive, 'a') as archive:
            archive.writestr('other.txt', 'changed archive')
        with self.assertRaisesRegex(ValueError, 'checksum'):
            module.verify(self.archive, self.manifest)

    def test_missing_media_and_content_drift_detected(self):
        self.export()
        module.create(self.archive, self.manifest)
        with sqlite3.connect(self.root / 'wp-content/database/.ht.sqlite') as c:
            c.execute('UPDATE test_posts SET post_title="Changed"')
        with self.assertRaisesRegex(ValueError, 'published_content'):
            module.verify(self.archive, self.manifest, site=self.root)
        with sqlite3.connect(self.root / 'wp-content/database/.ht.sqlite') as c:
            c.execute('INSERT INTO test_postmeta VALUES ("_wp_attached_file","missing.png")')
        self.assertEqual(module.site_snapshot(self.root)['missing_media'], ['missing.png'])

    def test_source_drift_and_url_relocation(self):
        self.export()
        module.create(self.archive, self.manifest)
        with sqlite3.connect(self.root / 'wp-content/database/.ht.sqlite') as c:
            c.execute('UPDATE test_options SET option_value="http://after.test" WHERE option_name="home"')
            c.execute('UPDATE test_posts SET post_content="http://after.test/image.png"')
        module.verify(self.archive, self.manifest, site=self.root)
        self.source.write_text('changed locally')
        with self.assertRaisesRegex(ValueError, 'does not match'):
            module.verify(self.archive, self.manifest, checkout=True)

    def test_unsafe_archive_entry_rejected(self):
        self.export()
        with zipfile.ZipFile(self.archive, 'a') as archive:
            archive.writestr('../outside', 'unsafe')
        with self.assertRaisesRegex(ValueError, 'Unsafe'):
            module.create(self.archive, self.manifest)


if __name__ == '__main__':
    unittest.main()
