# Reconcile complete core distribution

- [x] Complete phase scope.
- [x] Verify and record evidence.
- [x] Review diffs, commit and back up checkpoint through usual script.

All 3,338 required non-content files match the official WordPress 7.1.3 checksum inventory byte-for-byte. Removed 21 quarantined aliases with 90-character truncated paths; the 25 valid untracked additions are retained and committed with the installed 7.1.3 update. Studio `core verify-checksums` now passes without extra-file warnings. Project theme/plugin source unchanged. AGENTS.md baseline updated to the already installed 7.1.3 version.

Desktop Home and mobile-menu browser smoke: 2/2 passed. Full phase Studio export: `.backups/vendor-cleanup-core.zip`. Checkpoint uses the usual push script.

Core checkpoint `ae144f3` pushed and backed up as `studio-exports/lakehub-social-studio-20261027T052317Z.zip` with checksum and source manifest.
