# Transformation circles

## Objective and agreed behavior

Desktop retains horizontal overlap; <=900px uses one centered column of circles max 22rem diameter with ~12% overlap. Blend emphasis by pointer proximity desktop or viewport center mobile. Anchored centers; scale 1..1.05, text width 72..82%, siblings opacity toward .85 and slightly grey text with readable contrast. Strongest circle draws in front at crossover. Reset on pointer exit; static readable editor/no-JS/reduced-motion. Allow content-driven size under enlarged text.

## Implementation

Theme CSS/JS.

Commit: `feat: blend transformation circle emphasis responsively`

## Acceptance

Continuous transfer desktop/mobile, overlap, 320px and text zoom, contrast, no snap/overflow, final combined regressions.

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
