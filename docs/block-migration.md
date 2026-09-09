# Block-theme implementation and operations

This document describes the original migration. The subsequent exported-design refresh, its separate commands and snapshot, and current source references are documented in [design-refresh.md](design-refresh.md).

LakeHub Social 3.0.0 is a WordPress 7.1 block theme. LakeHub Site 1.0.0 owns the existing `program` post type, the `lakehub/programs` dynamic block, and the explicit migration. No content is seeded on activation or ordinary administrator requests.

## Design sources

- [Home, node 134:3](https://www.figma.com/design/w9CKeLbqHoTXQczTCfsyyi/LakeHub-production?node-id=134-3)
- [Programs, node 299:174](https://www.figma.com/design/w9CKeLbqHoTXQczTCfsyyi/LakeHub-production?node-id=299-174)

The initial desktop reference is 1280px. Theme tokens define fonts, colors, gradients, spacing, and fluid type. Registered block styles supply the composed layouts; native blocks hold editable content. Small-screen layouts stack the same content, retain all photos, and make Insights horizontally scrollable. Motion is limited to short hover transitions and user-triggered scrolling.

Original raster/vector assets from these nodes are bundled locally. The Zone01 photo and program photos retain their exact exported bytes; some `.png` asset URLs returned JPEG bytes. The importer detects the actual MIME type and uses the correct Media Library extension. Existing exact home images, fonts, and partner assets are reused. No expiring Figma URL is used by the shipped site.

The four local `assets/gradients/program-*.svg` files preserve the gradient geometry returned by Figma's design-context export. They supplement the shared color/gradient presets without embedding arbitrary layout HTML in page content.

## Migration

Run from this site's root. Confirm the local target, export the database, and keep the matching source revision before applying changes:

```bash
wp --path="$PWD" option get siteurl
wp --path="$PWD" db export .backups/before-block-theme.sql --add-drop-table
chmod 600 .backups/before-block-theme.sql
wp --path="$PWD" plugin activate lakehub-site
wp --path="$PWD" lakehub blocks migrate --dry-run
wp --path="$PWD" lakehub blocks migrate
```

The migration locates the configured front page and existing `/programs/` page, preserving their IDs and slugs. It updates the four existing program records and three existing insight excerpts/images to the Figma defaults. It preserves article bodies, destinations, legacy homepage metadata, other pages, and unrelated posts. Missing expected records stop the migration instead of creating duplicates.

`lakehub_block_media` records imported attachment IDs. Failed runs can reuse completed imports. `lakehub_block_migration_snapshot` retains the original affected fields and metadata; `lakehub_block_migration_version` prevents completed runs from overwriting editor changes. Existing classic menu assignments are imported to native Navigation records; filesystem defaults apply when there were no assigned menus.

The page content lives in the database as normal editable blocks. The shipped defaults remain in filesystem patterns. Changing a pattern file does not update copies already inserted into pages; use an explicit versioned migration for later structural changes. Shared header/footer defaults are in template parts and patterns. Export approved Site Editor structural overrides into source before release.

## Rollback

For a full rollback, restore the pre-migration database together with its matching classic-theme source, following the site's database-import approval and backup rules. Do not restore only one half.

For testing or recovering migration-owned content fields:

```bash
wp --path="$PWD" lakehub blocks rollback
```

This restores the saved page/program/insight fields, thumbnail assignments, and template assignments. It clears the completion marker but retains imported media and the snapshot for a repeatable reapplication. It does not restore theme source, remove unrelated edits, or delete uploads. Running rollback after client editing would replace the affected fields with the original snapshot; take a fresh database backup first.

## Verification tooling

PHP syntax checks cover the theme and `wp-content/plugins/lakehub-site`. `scripts/tests/block-editor.cjs` uses Playwright plus a supplied authenticated storage-state file to test native block parsing, page save/reload, section insertion/reordering/removal, image/text/link edits, program controls, mobile navigation, and reduced motion. It creates temporary draft records and deletes those records on completion. Existing pages are saved without content edits.

```bash
LAKEHUB_TEST_URL=http://127.0.0.1:8080 \
LAKEHUB_TEST_STATE=.runtime/browser-state.json \
node scripts/tests/block-editor.cjs
```

Use the installed Playwright package or set `NODE_PATH` to an existing installation. `CHROMIUM_PATH` can select an already installed Chromium executable. Never commit browser storage state, session tokens, or database dumps.

Newsletter submission and program destination URLs remain intentionally unset. No deployment, Git commit, or push is part of this migration.

## Verification performed on 7 September 2026

- Both page editors and all 11 registered LakeHub patterns parsed without invalid blocks. Both pages saved and reloaded successfully.
- Temporary drafts verified text editing, image replacement, button destinations, section movement/insertion/removal, and program image/description/link/order controls. Test records were removed.
- Both pages were checked at 1440, 1280, 1024, 768, 390, and 320px: no missing images, document overflow, or clipped program descriptions. The Programs block rendered all four entries in the editor preview.
- Desktop screenshots were compared with the exact Figma frames. Home's overall 3521px height and section boundaries match the reference at 1280px. Program cards can expand when edited text requires more space.
- Native mobile menu opening, Escape dismissal, and reduced-motion scrolling passed. The existing insight article returned HTTP 200; unpublished/nonexistent pages correctly returned HTTP 404.
- Theme JSON and block metadata passed the official WordPress schemas. PHP syntax, JavaScript syntax, Git whitespace checks, and WordPress database/theme/plugin health checks passed.
- Migration idempotence, rollback, reapplication, and attachment reuse passed. The migrated state is active. The pre-migration database backup is `.backups/before-block-theme-20260907.sql` (local and ignored).
