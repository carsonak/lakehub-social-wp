#!/usr/bin/env bash

# ==============================================================================
# LakeHub Social WordPress - Initial Project Setup Script
# ==============================================================================
# Bootstraps the local environment for a newly cloned repository by validating
# required CLI dependencies, checking Cloudflare R2 credentials, and downloading
# the latest WordPress Studio export archive for initial import.
#
# Usage:
#   ./scripts/setup.sh
#
# Workflow:
#   1. Asserts presence of required binaries (studio, rclone, unzip, sha256sum).
#   2. Loads environment from .env and verifies R2 configuration.
#   3. Tests R2 connectivity and authentication.
#   4. Downloads and validates the latest full Studio export from Cloudflare R2 into
#      .backups/studio-restore/latest.zip.
#   5. Guides the user to import the downloaded archive via WordPress Studio UI
#      using "Add site > Import from a backup" targeting this repository.
#
# shellcheck disable=SC2310
set -Eeuo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

# Main execution entrypoint for the initial setup script.
# Exits:
#   Terminates if arguments are passed, dependencies missing, or sync fails.
main() {
  [[ $# -eq 0 ]] || die "Usage: ./scripts/setup.sh"
  require_command studio
  require_command rclone
  require_command unzip
  require_command sha256sum
  load_env
  require_settings
  check_r2

  mkdir -p "${BACKUP_DIR}/studio-restore"
  local archive="${BACKUP_DIR}/studio-restore/latest.zip"
  log "Downloading and validating the latest full Studio export."
  download_latest_studio_export "${archive}"

  log "Restore package ready: ${archive}"
  log "In WordPress Studio, choose Add site > Import from a backup, select this archive, and use this repository as the site directory."
  log "Studio owns wp-config.php, wp-content/db.php, and wp-content/database/.ht.sqlite; do not copy database credentials into .env."
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  main "$@"
fi
