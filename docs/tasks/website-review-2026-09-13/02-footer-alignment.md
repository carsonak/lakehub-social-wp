# Footer alignment

## Objective and agreed behavior

Align visible letter tops of LakeHub, Quick Links, Help, Get in touch; separately align About Us, FAQ, Subscribe to our news letter. Preserve the original logo, shared native markup and responsive column stacking.

## Implementation

Shared footer CSS.

Commit: `fix: align footer headings and first text rows`

## Acceptance

Font-loaded screenshots at desktop/mobile; all shared page footers, no overflow, editor parity.

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
