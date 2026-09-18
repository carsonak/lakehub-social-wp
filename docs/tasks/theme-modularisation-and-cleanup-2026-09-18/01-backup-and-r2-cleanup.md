# Task 01: Backup & Cloudflare R2 Cleanup

## Scope & Objective
- Delete all local backups and runtime stage archives older than Monday 2026-09-14:
  - In `.runtime/review-20260913/`: Remove the 10 stage zip archives, logs, and pre-apply packages (~872 MB).
  - In `.backups/`: Remove legacy SQL dumps from Sep 4 to Sep 12 (`before-*.sql`, `pre-restore/*.sql.gz`, `lakehub-social-studio-20260912*.zip`).
  - Retain today's verified export (`studio-export-20260918-v2.zip` + `.sha256`) and the clean Git history.
- Clean up Cloudflare R2 storage to enforce retention and eliminate stale objects.

## Checklist
- [x] Inspect and remove obsolete runtime review zips in `.runtime/review-20260913/`.
- [x] Inspect and remove pre-Monday `.backups/` and `.backups/pre-restore/` dumps.
- [x] Verify Cloudflare R2 storage objects and prune any excess/stale exports beyond retention.
- [x] Verify disk savings (~1.2 GB reclaimed).

