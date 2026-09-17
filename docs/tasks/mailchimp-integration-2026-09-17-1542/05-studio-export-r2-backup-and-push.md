# Task 05: Studio Full Export, Cloudflare R2 Backup, and Git Push

## Objective and Agreed Behavior

1. **Studio Full Site Export**:
   - Generate full site backup archive `.zip` via WordPress Studio MCP (`site_export` tool) capturing SQLite database, all uploaded media, active theme, and plugins (including `mailchimp-for-wp` and `lakehub-site`).

2. **Cloudflare R2 Backup Upload**:
   - Execute `./scripts/push.sh "commit message" /absolute/path/to/studio-export.zip`.
   - Script validates ZIP archive integrity, uploads to Cloudflare R2 as both a timestamped export (`lakehub-social-studio-<timestamp>.zip`) and `latest.zip` with SHA256 checksums, and prunes older exports retaining the latest 5 timestamped backups.

3. **Git Branch Push**:
   - Push branch `main` to GitHub origin.

## Progress & Tracking

- [x] Generate full Studio export archive (`.backups/studio-export.zip`).
- [x] Run `./scripts/push.sh` with validated export.
- [x] Verify Cloudflare R2 upload and checksum.
- [x] Verify GitHub push of `main` branch.
