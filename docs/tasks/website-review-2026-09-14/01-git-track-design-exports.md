# Task 01: Git Tracking of Design Exports

## Objective and Agreed Behavior

Move the 8 newly supplied Figma export files (PNG @ 2x and SVG @ 1x for Home, About, Impact, and Our Programs) from the ignored `.runtime/design-exports/` folder to `docs/design-exports/` so that design references are durable, version-controlled in Git, and available to all agents and contributors.

---

## Detailed Instructions for Implementing Agent

### 1. Files to Migrate
Source directory: `.runtime/design-exports/`
Target directory: `docs/design-exports/`

Files to move:
1. `About.png` (7.9 MB)
2. `About.svg` (11.5 MB)
3. `Home.png` (6.6 MB)
4. `Home.svg` (17.9 MB)
5. `Impact.png` (5.0 MB)
6. `Impact.svg` (824 KB)
7. `Our Programs.png` (10.1 MB)
8. `Our Programs.svg` (14.8 MB)

### 2. Steps
1. Create the destination directory:
   ```bash
   mkdir -p docs/design-exports
   ```
2. Move the files from `.runtime/design-exports/` into `docs/design-exports/`:
   ```bash
   mv .runtime/design-exports/* docs/design-exports/
   ```
3. Verify that `git status --short` shows all 8 files under `docs/design-exports/` as untracked files ready to be staged:
   ```bash
   git status --short
   ```
4. Stage and commit:
   ```bash
   git add docs/design-exports/
   git commit -m "docs: add figma design exports for git version control"
   ```

---

## Acceptance Criteria

- All 8 export files exist in `docs/design-exports/` and are tracked by Git.
- No files remain orphaned in `.runtime/design-exports/`.
- `git status` shows clean tracking of the assets in `docs/design-exports/`.

---

## Progress & Tracking

- **Status**: `Complete`
- [x] Directory `docs/design-exports/` created
- [x] All 8 files moved from `.runtime/design-exports/`
- [x] Integrity and file count verified
- [x] Changes staged and committed
- **Last Checkpoint**: Exports moved to `docs/design-exports/` and staged for backup, 14 September 2026.
- **Next Action**: Execute Task 02 (Halftone Grid Sizing & Offsets).
- **Commit Receipt**: *Pending push script execution*

---

## Unplanned Changes & Scope Deviations

*(Document here any deviations, edge cases, or adjustments made during execution that were not part of the initial plan.)*
- None recorded yet.

---

## Recovery

To roll back this task before committing:
```bash
mv docs/design-exports/* .runtime/design-exports/
rmdir docs/design-exports
```
After committing:
```bash
git revert HEAD
```
