# Task 02: PHP Bootstrap Modularisation (`functions.php`)

## Scope & Objective
Modularise `wp-content/themes/lakehub-social/functions.php` by separating concerns into dedicated files under `wp-content/themes/lakehub-social/inc/`:
- `inc/enqueue.php`: Theme setup, styles, scripts, and `should_load_separate_core_block_assets`.
- `inc/block-styles.php`: Registration array for 38+ custom block styles.
- `inc/block-filters.php`: Render block filters (`core/navigation-link` and `core/cover` slideshow).
- `inc/halftone.php`: Halftone editor asset enqueue and `core/image` render filter.
- `functions.php`: Clean bootstrap requiring the files in `inc/`.

## Checklist
- [x] Create `inc/block-styles.php` and migrate block style registrations.
- [x] Create `inc/block-filters.php` and migrate navigation link and cover slideshow filters.
- [x] Create `inc/halftone.php` and migrate halftone editor hooks and image render filter.
- [x] Create `inc/enqueue.php` with theme support, asset enqueueing, and `should_load_separate_core_block_assets`.
- [x] Refactor `functions.php` to cleanly require the modular include files.
- [x] Run PHP linting (`php -l`) and verify theme loads without error.

