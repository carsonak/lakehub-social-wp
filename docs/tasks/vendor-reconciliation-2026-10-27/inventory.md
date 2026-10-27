# Exact-version vendor inventory

## Sources

- WordPress 7.1.3 official checksum API: https://api.wordpress.org/core/checksums/1.0/?version=7.1.3&locale=en_US
- MCP Adapter v0.6.1 official release: https://github.com/WordPress/mcp-adapter/releases/tag/v0.6.1
- MCP release ZIP: https://github.com/WordPress/mcp-adapter/releases/download/v0.6.1/mcp-adapter.zip
- WSP MCP 2.8.0 official ZIP: https://downloads.wordpress.org/plugin/wsp-mcp-ai-agents-connector.2.8.0.zip
- WSP official checksum API: https://downloads.wordpress.org/plugin-checksums/wsp-mcp-ai-agents-connector/2.8.0.json

## Findings

| Package | Expected files | Missing | Changed | Extraneous |
| --- | ---: | ---: | ---: | ---: |
| Core 7.1.3, excluding wp-content | 3,338 | 0 | 0 | 21 |
| MCP Adapter 0.6.1 | 313 | 0 | 0 | 212 |
| WSP MCP 2.8.0 | 36 | 0 | 0 | 23 |

All 25 untracked core files belong to the official 7.1.3 inventory. They are legitimate additions to the older tracked 7.1 baseline and must be committed, not ignored. The 21 extraneous core files are already tracked; their pathnames are truncated to 90 characters. Each has a correctly named official counterpart. Do not confuse these with the valid untracked files.

All 235 untracked plugin files are absent from the exact-version release inventories. Existing required plugin files are byte-identical to their official archives. Remove only these extra files; do not reinstall or upgrade the plugins.

Ignored local rollback artifacts: `.backups/vendor-cleanup-before.zip`, `.backups/vendor-cleanup/original-vendor-differences.tar.gz`, `.backups/vendor-cleanup/verified-obsolete-files.tar.gz`, file-hash manifests, official metadata and release ZIPs. Core files are not included in Studio full exports, so the separate quarantine tar preserves them. The obsolete-file archive includes all 256 files selected for removal.

No project-owned theme/plugin source or saved site content is part of this reconciliation.
