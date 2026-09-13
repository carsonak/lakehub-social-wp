# Impact number reveal

## Objective and agreed behavior

Reveal each metric description once per visit at half-visible first downward entry. Emerge horizontally from its number on desktop, downward on mobile, 550ms. Keep layout reserved and reveal passed rows on restoration. Hover scales complete photo-filled number 1.04 over 200ms.

## Implementation

Theme CSS/JS.

Commit: `feat: reveal impact descriptions from their numbers`

## Acceptance

Independent one-time row reveal, alternating origin, number image fill, saved content editability, mobile, reduced motion and no-JS.

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
