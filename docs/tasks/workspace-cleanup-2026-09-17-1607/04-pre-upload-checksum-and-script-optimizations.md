# Task 04: Pre-Upload Checksum & Script Optimizations

## Objective and Agreed Behavior

1. **Pre-Upload Checksum Validation**:
   - In `scripts/lib/common.sh`:
     - Update `upload_studio_export()` to compute SHA256 and run `verify_checksum()` before uploading.
     - Check remote `latest.zip.sha256` to determine if remote is already identical.
     - Upload to timestamped archive once.
     - Perform Cloudflare R2 server-side copy from timestamped archive to `latest.zip` and `latest.zip.sha256`.

2. **Conditional Checksum-Based Pull**:
   - In `scripts/lib/common.sh`:
     - Update `download_latest_studio_export()` to fetch remote `latest.zip.sha256` first.
     - If local `${destination}` already matches remote SHA256, skip the multi-megabyte download and validate local archive immediately.
     - Otherwise download and verify.

3. **Validation**:
   - Run `shellcheck` and `bash -n` on all shell scripts.

## Progress & Tracking

- [x] Implement pre-upload checksum verification and server-side R2 copy in `upload_studio_export()`.
- [x] Implement conditional checksum check in `download_latest_studio_export()`.
- [x] Validate shell script syntax and quality with `bash -n` and `shellcheck`.
