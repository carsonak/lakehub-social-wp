# Verification, backup and preview

- [x] Complete regression verification and final full Studio export.
- [x] Record verification.
- [x] Complete Git/R2 backup checkpoint.
- [ ] Refresh preview and smoke-test hosted hero styles (approval blocked).

Verification: six focused hero tests and all 33 existing interaction tests passed. Project PHP lint, theme static checks, Bash syntax, ShellCheck and seven backup unit tests passed. No block markup or database content changed. Editor stylesheet loading is covered by the static enqueue check.

Implementation checkpoint: `d1ab027 fix(theme): unify photo hero typography`. Export: `.backups/hero-typography-final.zip`; `scripts/verify-restore.sh` passed with matching source, SQLite health and content/media evidence. The backup manifest observes the runtime at export time; no versions are pinned as restore requirements.

The existing Studio-associated preview is https://carsoniskihara-grykm-studio.wp.build (Preview 2; not expired when inspected). The `preview_update` tool was rejected by automatic approval review: a full local-site upload to this specific hostname requires explicit authorization. No CLI workaround was attempted, and the preview still contains the previous version. Request approval for this destination before retrying, then run the focused typography suite with `LAKEHUB_TEST_URL` set to that URL.

Backup completed successfully through `scripts/push.sh`: `studio-exports/lakehub-social-studio-20261028T220816Z.zip` plus `latest.zip`, checksums and manifests; implementation pushed to origin/main. Transient R2 501 responses recovered through built-in retries. Final documentation checkpoint reuses this same verified ZIP; the script can skip the identical archive upload and refresh the manifest.
