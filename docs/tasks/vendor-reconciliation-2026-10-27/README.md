# Vendor reconciliation — 2026-10-27

User approved reconciling installed packages with clean distributions, removing verified obsolete leftovers, committing the intended vendor baseline separately, and backing up through the usual scripts. Preserve WordPress 7.1.3, MCP Adapter 0.6.1 and WSP MCP 2.8.0; do not upgrade/downgrade packages or change site content.

## Strategy

Get exact-version canonical package/checksum inventories into ignored staging. Validate package files before changing the canonical site. Quarantine files not belonging to those inventories with their hashes before removal. Reconcile core and plugin packages separately; Git stores complete distribution source. Keep uploads, SQLite, wp-config.php and Studio integrations ignored. Do not hide vendor leftovers via .gitignore. Keep project theme/plugin content untouched.

| Phase | Scope | Status |
| --- | --- | --- |
| 01 | Preserve full Studio export plus core/plugin file quarantine; verify exact-version inventories | Complete |
| 02 | Align tracked core with installed clean 7.1.3 distribution; remove confirmed obsolete core files | Complete |
| 03 | Reconcile MCP Adapter 0.6.1 and WSP MCP 2.8.0 package inventories | Complete |
| 04 | Runtime/browser/source checks, final conventional checkpoint and full R2/Git backup | Complete |

## Verification matrix

Exact-version file digests/checksums and inventory; no project-owned source drift; preserved SQLite/media/content snapshot; Studio core/theme/plugin state; project PHP/JS/CSS/Bash/ShellCheck; existing 33 browser tests; read-only source/export/restore verification; final Git status clean apart from explicitly documented pre-existing unrelated changes. Each phase gets its own conventional commit and full Studio backup through scripts/push.sh.

Final verification additionally covers fresh-checkout byte identity: vendor-only `.gitattributes` disables automatic line-ending conversion for stock core and the two reconciled plugins; project theme/plugin text settings remain unchanged.

## Result

Retained/committed 25 valid core additions and the installed 7.1.3 distribution. Removed 21 tracked truncated core aliases and 235 untracked plugin leftovers. All exact-version distributions are clean. Full browser suite 33/33; backup tests 7/7; source/data preservation and fresh Git-tree checksum verification pass. Final backup uses `.backups/vendor-cleanup-final.zip` through the usual script.
