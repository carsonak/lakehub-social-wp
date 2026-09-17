# Task 05: Re-Export, Testing & Push Benchmark

## Objective and Agreed Behavior

1. **Automated Test Validation**:
   - Run `mailchimp-newsletter.cjs` (5/5 passed).
   - Run `ui-tweaks-2026-09-17.cjs` (7/7 passed).
   - Run `review-followup-2026-09-16.cjs` (7/7 passed).

2. **Generate Fresh Full Studio Export**:
   - Use WordPress Studio MCP `site_export` tool to generate a new `.zip` archive at `.backups/studio-export.zip`.
   - Measure new archive size: compare against earlier 107 MB baseline.

3. **Cloudflare R2 Push with Server-Side Copy**:
   - Run `./scripts/push.sh` with the new Studio export.
   - Verify pre-upload checksum verification.
   - Verify R2 server-side copy to `latest.zip` (instantaneous second copy).

4. **Pull Performance Benchmark**:
   - Run `./scripts/pull.sh`.
   - Verify conditional checksum evaluation skips redundant multi-megabyte download when already up to date.

## Progress & Tracking

- [x] Run full Playwright test suite with 100% pass rate.
- [x] Export fresh lean Studio site archive (`.backups/studio-export.zip` at 84 MB vs 107 MB).
- [x] Run `./scripts/push.sh` and benchmark upload performance.
- [x] Run `./scripts/pull.sh` and verify conditional sub-second execution.
