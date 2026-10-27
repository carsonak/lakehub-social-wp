# Final verification and backup

- [x] Verify exact working-tree inventories: all 3,338 required core files and 349 plugin files match upstream, with no extras.
- [x] Preserve canonical distribution line endings through vendor-only .gitattributes; CRLF-aware whitespace checks do not modify official bytes.
- [x] Stream a fresh staged Git-tree archive and verify every core/plugin file against upstream digests: 0 missing, unexpected or mismatched files.
- [x] Existing browser suite: 33/33 passed; backup tests: 7/7 passed; PHP lint across project and both cleaned plugins; JS/CSS/local-asset/enqueue checks; Bash and ShellCheck.
- [x] Compare pre-cleanup/current published content, active options, original media inventory and project-owned source: unchanged.
- [x] Review intended staged changes, create the final conventional checkpoint and back up using the usual script.

The four stock core files with upstream CRLF endings are stored byte-for-byte in Git. `git diff --cached --ignore-space-at-eol` confirms no semantic changes in those files. The vendor-only attributes preserve bytes; no .gitignore rules were added to conceal files.

Full final Studio export: `.backups/vendor-cleanup-final.zip`. The usual `scripts/push.sh` stores it in R2 as a timestamped archive and `studio-exports/latest.zip`, with SHA-256 and dynamic source manifest companions, and pushes the phase commits to GitHub. Final read-only restore evidence: `.backups/vendor-cleanup/final-restore-verification.log`.

Removed originals remain recoverable through `.backups/vendor-cleanup/verified-obsolete-files.tar.gz` and pre-cleanup Studio export; the pre-cleanup tracked core is also preserved in Git history. Package versions remain WordPress 7.1.3, MCP Adapter 0.6.1 and WSP MCP 2.8.0.
