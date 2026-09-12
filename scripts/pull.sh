#!/usr/bin/env bash

# shellcheck disable=SC2310
set -Eeuo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

main() {
  [[ $# -eq 0 ]] || die "Usage: ./scripts/pull.sh"
  load_env
  require_settings
  require_command rclone
  require_command unzip
  require_command sha256sum
  require_git_repository
  [[ -z "$(git_repo status --porcelain)" ]] || die "Git worktree is not clean; commit or stash changes before pulling."
  check_r2

  log "Pulling Git changes with fast-forward-only policy."
  git_repo pull --ff-only

  mkdir -p "${BACKUP_DIR}/studio-restore"
  local archive="${BACKUP_DIR}/studio-restore/latest.zip"
  log "Downloading and validating the latest full Studio export."
  download_latest_studio_export "${archive}"
  log "Pull complete. To restore data, stop the current site and import ${archive} with WordPress Studio's Import/Export UI."
  log "Import is intentionally not automatic because it replaces the local SQLite database and wp-content snapshot."
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  main "$@"
fi
