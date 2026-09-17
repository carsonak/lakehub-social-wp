# Task 03: Cloudflare R2 Remote Storage Cleanup

## Objective and Agreed Behavior

1. **Delete Remote Legacy Database Backups (< Monday 2026-09-14)**:
   - In Cloudflare R2 `lakehub-social-studio`:
     - Delete legacy database backups in `r2:lakehub-social-studio/database/` dated prior to Monday 2026-09-14 (all files from Sep 02, Sep 03, Sep 04, Sep 07, Sep 09, and Sep 11).

2. **Delete Remote Legacy Unzipped Uploads Tree**:
   - In Cloudflare R2 `lakehub-social-studio`:
     - Delete `r2:lakehub-social-studio/uploads/` (legacy unzipped directory containing old demo caches and uploads predating the Studio export `.zip` standard).

3. **Preserve Active Studio Export Archives**:
   - Retain all `studio-exports/` archives created this week (Sep 14 to present).

## Progress & Tracking

- [x] List and delete legacy `database/` SQL dumps on R2 older than Monday 2026-09-14.
- [x] Delete legacy root `uploads/` tree on R2.
- [x] Verify R2 bucket contents (only `studio-exports/` archives from Sep 14+ retained).
