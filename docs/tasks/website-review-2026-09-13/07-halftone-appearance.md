# Halftone appearance

## Objective and agreed behavior

Isolate design departure in own stylesheet/tokens/commit. Derive tile from original local SVG; preserve originals. Desktop 36px spacing/~14px dots; <=600px 16px spacing/~6px dots. At rest expose exactly two left columns and one top row anchored to image. Reserve responsive space. Override task 06 spacing without JS changes.

## Implementation

Isolated decoration stylesheet, derived asset and theme enqueue. Depends on 06.

Commit: `design: densify and align halftone backgrounds`

## Acceptance

Three images consistent; responsive overflow and row counts; revert only this commit and verify original decoration plus working hover.

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
