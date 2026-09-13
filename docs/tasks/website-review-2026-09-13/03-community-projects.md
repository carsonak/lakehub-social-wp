# Community Projects

## Objective and agreed behavior

Rename Impact heading and editor metadata in source and saved page. Preserve #community-engagements and all unrelated content. Add explicit lakehub review-20260913 rename-community apply --dry-run, apply and rollback commands with snapshot, idempotence and conflict protection. Full Studio export before apply.

## Implementation

Impact pattern and LakeHub Site CLI-only migration.

Commit: `fix: rename Community Engagements to Community Projects`

## Acceptance

Dry-run changes nothing; apply alters only intended fields; repeat safe; rollback protects edits; disposable SQLite verification and editor save/reload.

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
