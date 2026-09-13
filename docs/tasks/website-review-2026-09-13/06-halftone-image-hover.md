# Halftone image hover

## Objective and agreed behavior

Repel About story and Impact community/portfolio photograph frames from pointer in any direction, capped at one dot spacing total. Stationary layout bounds and decoration; preserve internal crops. Reset on leave/cancel/preference change. No touch/reduced-motion/editor movement. CSS spacing defaults must work with original decoration.

## Implementation

Theme CSS/JS. Implement before task 07 for independent revert.

Commit: `feat: move halftone images away from the pointer`

## Acceptance

All directions, cap, smooth reset, no jitter/layout shift/crop changes, touch/reduced motion.

## Progress

- Status: not started
- [ ] Implementation complete
- [ ] Relevant checks and visual/editor verification complete
- [ ] Intended diff reviewed and committed
- [ ] Fresh full Studio export backed up to R2 and Git pushed
- Last checkpoint: plan recorded, 2026-09-13.
- Next action: implement after earlier tasks have been verified.
- Evidence: pending.
- Commit/export/R2/push receipt: pending; reconcile Git and runtime receipts before retry.
- Blockers: none identified beyond shared runtime prerequisites in README.

## Recovery

Revert this task's source commit to recover prior behavior. Task 03 also requires its guarded CLI rollback before source removal; export first. Task 07 must revert independently without disabling task 06. Do not reset unrelated work or reapply earlier content migrations.
