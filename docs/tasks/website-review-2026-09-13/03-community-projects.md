# Community Projects

## Objective and agreed behavior

Rename Impact heading and editor metadata in source and saved page. Preserve #community-engagements and all unrelated content. Add explicit lakehub review-20260913 rename-community apply --dry-run, apply and rollback commands with snapshot, idempotence and conflict protection. Full Studio export before apply.

## Implementation

- **Source pattern**: [`wp-content/themes/lakehub-social/patterns/impact-page.php`](file:///home/line/projects/lakehub-social-wp/wp-content/themes/lakehub-social/patterns/impact-page.php)
  - Update `metadata.name`: `"Impact · Community Projects"` (was `"Impact · Community Engagements"`).
  - Update heading text: `Community <mark ... class="has-inline-color has-teal-color">Projects</mark>` (was `Engagements`).
  - **Preserve**: Section anchor `id="community-engagements"`, template lock `contentOnly`, and all inner vendor and Malika content blocks.
- **Plugin migration**: [`wp-content/plugins/lakehub-site/includes/review-20260913.php`](file:///home/line/projects/lakehub-social-wp/wp-content/plugins/lakehub-site/includes/review-20260913.php)
  - Register `lakehub review-20260913 rename-community apply` (with `--dry-run`) and `rollback` subcommands.
  - Require in [`wp-content/plugins/lakehub-site/lakehub-site.php`](file:///home/line/projects/lakehub-social-wp/wp-content/plugins/lakehub-site/lakehub-site.php) under `defined( 'WP_CLI' ) && WP_CLI`.
  - Target: Impact page (`get_page_by_path( 'impact', OBJECT, 'page' )`).
  - Transaction safety: Wrap DB updates in `START TRANSACTION` / `COMMIT` / `ROLLBACK`.
  - Snapshot & Idempotence: Save before/after SHA-256 in option `lakehub_review_20260913_rename_community_snapshot`; set done option `lakehub_review_20260913_rename_community_done`.
  - Conflict protection on rollback: compare current post content hash against the `after` hash; abort if manual editor modifications occurred unless forced.

Commit: `fix: rename Community Engagements to Community Projects`

## Acceptance

- `studio wp --path="$PWD" lakehub review-20260913 rename-community apply --dry-run` reports exact planned heading change without writing to DB.
- `studio wp --path="$PWD" lakehub review-20260913 rename-community apply` updates only the Impact page heading and metadata. Repeated runs report already applied without writes.
- `studio wp --path="$PWD" lakehub review-20260913 rename-community rollback` restores original heading cleanly and detects conflicting editor changes.
- Frontend test: `REVIEW_TASK=03 node scripts/tests/review.cjs` asserts `h2` contains "Community Projects" and anchor `#community-engagements` works.
- Editor verification: Impact page loads in Site Editor without block recovery or validation errors.

## Progress

- Status: complete
- [x] Implementation complete
- [x] Relevant checks and visual/editor verification complete
- [x] Intended diff reviewed and committed
- [x] Fresh full Studio export backed up to R2 and Git pushed
- Last checkpoint: CLI migration dry-run, apply, rollback, re-apply, and Playwright tests verified, 2026-09-13.
- Next action: implement Task 04 (Program card scroll animation).
- Evidence: lakehub review-20260913 rename-community apply --dry-run verified. DB migration applied, idempotence confirmed, rollback verified, re-applied cleanly. REVIEW_TASK=03 node scripts/tests/review.cjs passed.
- Commit/export/R2/push receipt: full Studio export .runtime/review-20260913/03-community.zip, R2 backup and commit pending push execution.
- Blockers: none.

## Recovery

Revert this task's source commit to recover prior behavior. Task 03 also requires its guarded CLI rollback before source removal; export first. Task 07 must revert independently without disabling task 06. Do not reset unrelated work or reapply earlier content migrations.
