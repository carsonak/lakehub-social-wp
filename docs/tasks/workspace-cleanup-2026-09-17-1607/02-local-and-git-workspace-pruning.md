# Task 02: Local & Git Workspace Pruning

## Objective and Agreed Behavior

1. **Delete Obsolete Local Backups (< Monday 2026-09-14)**:
   - In `.backups/pre-restore/`:
     - Delete `pre-restore-2026-09-03T072555Z.sql.gz`
     - Delete `pre-restore-2026-09-07T085957Z.sql.gz`
     - Delete `pre-restore-2026-09-09T080900Z.sql.gz`
   - In `.backups/`:
     - Clean up stale temporary `studio-export.zip` and outdated cached restore archives.

2. **Purge Defunct Runtime MySQL Directory**:
   - Delete `.runtime/mysql/` (200 MB leftover from earlier MySQL testing; site runs on native Studio SQLite).

3. **Git Storage Maintenance**:
   - Run `git gc --prune=now`.
   - Packs ~145 MB of loose objects into optimized packfiles, shrinking `.git` from 210 MB down to ~60 MB.

## Progress & Tracking

- [x] Delete local `.backups` older than Monday 2026-09-14.
- [x] Delete defunct `.runtime/mysql/` directory.
- [x] Run `git gc --prune=now` and verify repository integrity with `git fsck`.
