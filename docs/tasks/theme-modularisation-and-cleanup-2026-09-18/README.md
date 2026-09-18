# Theme Modularisation & Artifact Cleanup Tasks (2026-09-18)

Master tracking for modularising theme CSS, JS, and PHP, pruning obsolete local backups/runtime artifacts older than Monday 2026-09-14, cleaning Cloudflare R2 storage, and checkpointing the verified codebase.

## Phase Status Table

| Phase | Description | Status | Commit / Artifact |
| :--- | :--- | :--- | :--- |
| **01** | [Backup & Cloudflare R2 Cleanup](01-backup-and-r2-cleanup.md) | Complete | ~1.2 GB reclaimed; R2 pruned |
| **02** | [PHP Bootstrap Modularisation (`functions.php`)](02-php-modularisation.md) | Complete | `inc/` includes created & linted |
| **03** | [CSS Modularisation (`style.css`)](03-css-modularisation.md) | Complete | 7 modular stylesheets created; `style.css` streamlined |
| **04** | [JavaScript Modularisation (`main.js`)](04-javascript-modularisation.md) | Complete | 8 feature modules created; `main.js` streamlined |
| **05** | [Verification & Regression Testing](05-verification-and-testing.md) | Complete | All Playwright and lint suites passed (0 errors) |
| **06** | [Final Studio Export & Cloudflare R2 Push](06-final-backup-and-push.md) | In Progress | Pending |
