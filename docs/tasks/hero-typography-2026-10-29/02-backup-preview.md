# Verification, backup and preview

- [x] Complete regression verification and final full Studio export.
- [x] Record verification.
- [x] Complete Git/R2 backup checkpoint.
- [x] Refresh preview and smoke-test hosted hero styles.

Verification: six focused hero tests and all 33 existing interaction tests passed. Project PHP lint, theme static checks, Bash syntax, ShellCheck and seven backup unit tests passed. No block markup or database content changed. Editor stylesheet loading is covered by the static enqueue check.

Implementation checkpoint: `d1ab027 fix(theme): unify photo hero typography`. Export: `.backups/hero-typography-final.zip`; `scripts/verify-restore.sh` passed with matching source, SQLite health and content/media evidence. The backup manifest observes the runtime at export time; no versions are pinned as restore requirements.

The user explicitly approved uploading the full site to the existing preview. Studio `preview_update` completed successfully at https://carsoniskihara-grykm-studio.wp.build. Hosted checks passed at all six widths (1440, 1280, 1024, 768, 390 and 320px), confirming equal size/weight, inline inheritance, line-height, containment and button separation across all four banners. The first two checks briefly received old CSS immediately after upload; the new stylesheet was confirmed present, and both checks passed on recheck after propagation. Logs: ignored `.runtime/hero-preview-tests.log` and `.runtime/hero-preview-recheck.log`.

Backup completed successfully through `scripts/push.sh`: `studio-exports/lakehub-social-studio-20261028T220816Z.zip` plus `latest.zip`, checksums and manifests; implementation pushed to origin/main. Transient R2 501 responses recovered through built-in retries. Final documentation checkpoint reuses this same verified ZIP; the script can skip the identical archive upload and refresh the manifest.
