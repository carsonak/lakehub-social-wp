# Program card scroll

## Objective and agreed behavior

Replace reveal-once with above/visible/below states. Entry/exit threshold is half the card, capped to half usable viewport for tall cards. Top offset -2.5rem, bottom +2.5rem; retain alternating +/-2rem desktop X, zero stacked X, 550ms transitions. Measure stable bounds; focused cards visible; preserve glare.

## Implementation

Theme CSS/JS and completion tests. Depends on 01 viewport boundary.

Commit: `feat: animate program cards through both viewport edges`

## Acceptance

Repeated up/down entry and exit, tall cards, fast reversal, restoration, focus, reduced motion and no-JS.

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
