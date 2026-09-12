#!/usr/bin/env bash

set -Eeuo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

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
