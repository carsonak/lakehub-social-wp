# Backup and restore during development

Git stores canonical source. A full Studio export stores SQL, uploads, plugins and themes. Neither replaces the other. A valid checksum proves byte integrity; passing interaction tests establish whether those bytes behave correctly.

## Create a checkpoint

1. Run `npm ci` and `npx playwright install chromium` when setting up a new machine. Run `npm run test:static`, `npm run test:backup`, and `npm test` against the running canonical Studio site. Set `LAKEHUB_TEST_URL` for a different local URL. Keep feature tests updated whenever behavior changes.
2. Review `git status --short`, `git diff`, and `git diff --cached`. Stage only intended changes. Make coherent conventional commits for completed phases.
3. Create a **Full site** export in Studio after the source and content checks. Do not edit project source between export and backup.
4. Run `./scripts/push.sh "conventional commit message" /absolute/path/to/export.zip`. It retains the normal staged-commit, R2 upload, checksum, retention and Git push workflow. It now verifies the exported project source against committed blobs before upload and writes a `.manifest.json` sidecar.
5. Record the test results and export path in the task checklist. The manifest records the exact source commit and per-file hashes, SQL/export checksums, Studio runtime/plugin/theme observations, and a read-only snapshot of published content/options/media at manifest creation. This snapshot is a live-site observation; it is not claimed to be parsed from the SQL dump. Avoid content edits between export and manifest creation, and verify after import.

Source roots are configured in `scripts/backup-sources.json`. Every tracked file under those roots is discovered dynamically. Add new project-owned roots there when introducing a theme or plugin. There are no fixed release numbers, content counts or dependency versions in the verifier. Runtime versions in an individual manifest are observations for that backup, not requirements for future development.

A source mismatch rejects the upload. Commit intended source and make a fresh export; do not weaken the check or copy an old manifest onto a newer ZIP. Unrelated vendor worktree differences remain unstaged and are not silently committed. The full export contains their observed installed versions.

## Recover onto a new machine

1. Clone Git, configure `.env` using `.env.example`, and run `./scripts/setup.sh`. For an existing clean checkout, `./scripts/pull.sh` fast-forwards and downloads the latest export. Both validate the archive/checksum and download/verify its manifest when available.
2. Read the manifest's `source_commit`. Use the source revision belonging to that backup for the initial restore. A later checkout may intentionally differ; reconcile it explicitly after proving the restore. Do not assume latest Git and latest export were produced together.
3. Verify the repository path and intended local URL in Studio. Import the validated full ZIP through Studio into this canonical repository; do not create a second canonical site. Preserve a full export before replacing an existing site's data.
4. Imports can replace `wp-content` source. Compare the imported project-owned source with its manifest before resuming changes. Run `./scripts/verify-restore.sh /absolute/path/to/export.zip`. This read-only command checks archive integrity, source fingerprints, SQLite integrity, published-content markers, active-theme/plugin options, and original media availability. It never imports, resets, reseeds, or changes URLs. URL normalization allows moving the same content to another local origin.
5. Start/manage the site through Studio. Inspect theme/plugin state and run the tests, including real hover, carousel, keyboard, mobile and reduced-motion behavior. Compare screenshots with the approved design references. Resolve reported drift before treating the restore as verified.
6. Resume development and create new source/export pairs normally. Future manifests automatically describe future revisions.

Legacy backups without a manifest still receive archive/checksum validation, but require manual identification of the matching Git source. A missing manifest download also reports possible network failure; it does not claim source verification. The read-only restore command fails explicitly for a legacy archive instead of inventing expectations from today's checkout.

## Regression coverage

Tests are in `scripts/tests/browser/`; reports, traces and screenshots stay in ignored `.runtime/`. They check complete card geometry and movement, looping logos, Journey dragging, hover/focus effects, header reset, portrait crop application, sheen, Mission/Vision counter-rotated zoom, story expansion, program/metric reveals, halftones, transformation hover, slideshow, share URLs and mobile navigation. Do not replace these with checks that only confirm script/style tags exist.

Editor roundtrip: create a disposable draft copied from representative saved content using Studio WP-CLI, title it `Recovery verification scratch draft`, then run `LAKEHUB_EDITOR_POST_ID=<id> npm run test:editor`. The script refuses any other title or published content, saves/reloads the draft, validates nested blocks and waits for asynchronous iframe styles. Delete the scratch draft and its revisions through Studio WP-CLI afterward.

## Preview

After verification and backup, create a new Studio preview. It is a temporary, expiring review link, not the backup or canonical development site. Record its URL/expiry with the task evidence.
