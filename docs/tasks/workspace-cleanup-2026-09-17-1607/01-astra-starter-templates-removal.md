# Task 01: Astra Starter Templates Removal & Uploads Cleanup

## Objective and Agreed Behavior

1. **Uninstall Astra Starter Templates**:
   - Deactivate `astra-sites` via WP-CLI: `studio wp --path="$PWD" plugin deactivate astra-sites`.
   - Uninstall and remove `astra-sites` from `wp-content/plugins/astra-sites`.
   - Remove `wp-content/uploads/ast-block-templates-json/` (49 MB of demo JSON template catalogs).
   - Remove `wp-content/uploads/astra-sites/` (4.7 MB of demo JSON caches and logs).

2. **Clean Verified Orphan Uploads**:
   - Delete `wp-content/uploads/2026/09/insight-zone01-1.png` (12 MB unreferenced duplicate).
   - Preserve all hero banner images at full quality (no downscaling/overcompression).

3. **Repository Rules & Documentation**:
   - Clean up `.gitignore` lines referencing `astra-sites/**/build/`.
   - Update `AGENTS.md` baseline active plugins list to reflect that Starter Templates has been removed.

## Progress & Tracking

- [x] Deactivate and uninstall `astra-sites` plugin.
- [x] Remove `wp-content/plugins/astra-sites/` from tracked repository.
- [x] Delete `wp-content/uploads/ast-block-templates-json/` and `wp-content/uploads/astra-sites/`.
- [x] Delete orphan `wp-content/uploads/2026/09/insight-zone01-1.png`.
- [x] Update `.gitignore` and `AGENTS.md`.
- [x] Verify site and block rendering without errors.
