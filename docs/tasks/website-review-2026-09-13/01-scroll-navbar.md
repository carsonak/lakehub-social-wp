# Scroll navbar

## Objective and agreed behavior

Make the outer header sticky without layout shift. Show initially and near the page top; beyond one header height hide after 24px down and show after 8px up. Animate 200ms. Pin visible for focus/mobile menu, respect admin bar and anchors. Reduced motion removes transitions; no JS leaves navigation visible.

## Implementation

Theme CSS and frontend JS.

Commit: `feat: show navigation on upward scroll`

## Acceptance

Scroll both directions, jitter, keyboard entry, mobile menu/Escape, admin bar, resize, reduced motion and no-JS.

## Progress

- Status: backup pending
- [x] Implementation complete
- [x] Relevant checks and visual/editor verification complete
- [ ] Intended diff reviewed and committed
- [ ] Fresh full Studio export backed up to R2 and Git pushed
- Last checkpoint: implementation and relevant checks passed, 2026-09-13.
- Next action: export, review/stage intended changes, commit and back up; reconcile receipts before retry.
- Evidence: REVIEW_TASK=01 node scripts/tests/review.cjs passed: direction thresholds, stable footprint, focus, mobile menu/Escape and reduced motion. JS syntax and whitespace passed.
- Commit/export/R2/push receipt: pending; reconcile Git and runtime receipts before retry.
- Blockers: none identified beyond shared runtime prerequisites in README.

## Recovery

Revert this task's source commit to recover prior behavior. Task 03 also requires its guarded CLI rollback before source removal; export first. Task 07 must revert independently without disabling task 06. Do not reset unrelated work or reapply earlier content migrations.
