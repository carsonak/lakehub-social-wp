# Scroll navbar

## Objective and agreed behavior

Make the outer header sticky without layout shift. Show initially and near the page top; beyond one header height hide after 24px down and show after 8px up. Animate 200ms. Pin visible for focus/mobile menu, respect admin bar and anchors. Reduced motion removes transitions; no JS leaves navigation visible.

## Implementation

Theme CSS and frontend JS.

Commit: `feat: show navigation on upward scroll`

## Acceptance

Scroll both directions, jitter, keyboard entry, mobile menu/Escape, admin bar, resize, reduced motion and no-JS.

## Progress

- Status: complete
- [x] Implementation complete
- [x] Relevant checks and visual/editor verification complete
- [x] Intended diff reviewed and committed
- [x] Fresh full Studio export backed up to R2 and Git pushed
- Last checkpoint: export and backup verified, 2026-09-13.
- Next action: complete task 02 backup and tracking.
- Evidence: REVIEW_TASK=01 node scripts/tests/review.cjs passed: direction thresholds, stable footprint, focus, mobile menu/Escape and reduced motion. JS syntax and whitespace passed.
- Commit/export/R2/push receipt: commit 3d889fb (feat: show navigation on upward scroll), full Studio export .runtime/review-20260913/01-navbar.zip, R2 backup studio-exports/lakehub-social-studio-20260913T160744Z.zip and latest.zip, Git branch main pushed to origin.
- Blockers: none.

## Recovery

Revert this task's source commit to recover prior behavior. Task 03 also requires its guarded CLI rollback before source removal; export first. Task 07 must revert independently without disabling task 06. Do not reset unrelated work or reapply earlier content migrations.
