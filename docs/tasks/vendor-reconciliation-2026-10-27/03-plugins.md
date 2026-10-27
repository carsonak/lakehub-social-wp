# Reconcile exact-version plugin distributions

- [x] Complete phase scope.
- [x] Verify and record evidence.
- [x] Review diffs, commit and back up checkpoint through usual script.

Removed 212 MCP Adapter and 23 WSP MCP untracked files after verifying their preserved hashes. MCP now contains exactly 313 release files; WSP exactly 36. All are SHA-256-identical to their official exact-version archives. WSP WordPress.org checksum command passes without added-file warnings. MCP verified against official GitHub release ZIP because WordPress.org has no checksums for this release. No tracked plugin files changed; their Git baseline was already correct. No package versions or activation states changed. Full plugin-phase export: `.backups/vendor-cleanup-plugins.zip`.

MCP ZIP additionally matches the SHA-256 digest published on the official GitHub release asset. PHP syntax across project and both cleaned plugins passes; WordPress boots with the same theme/five active plugins and exposes registered abilities without fatal errors. The final full browser suite runs in Phase 04.
