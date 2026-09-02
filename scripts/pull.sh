#!/usr/bin/env bash

# shellcheck disable=SC2310
set -Eeuo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

prune_safety_backups() {
  local directory="$1"
  local -a backups=()
  mapfile -t backups < <(find "${directory}" -maxdepth 1 -type f -name 'pre-restore-*.sql.gz' -printf '%T@ %p\n' | sort -nr | cut -d' ' -f2-)
  if ((${#backups[@]} > 5)); then
    local old_backup
    for old_backup in "${backups[@]:5}"; do
      rm -f -- "${old_backup}"
    done
  fi
}

main() {
  [[ $# -eq 0 ]] || die "Usage: ./scripts/pull.sh"
  load_env
  require_settings
  require_command wp
  require_command rclone
  require_command gzip
  require_git_repository

  [[ -z "$(git_repo status --porcelain)" ]] || die "Git worktree is not clean; commit or stash changes before pulling."
  ensure_database
  check_r2

  local archive
  LAKEHUB_TEMP_DIR="$(mktemp -d)"
  trap 'rm -rf -- "${LAKEHUB_TEMP_DIR}"' EXIT
  archive="${LAKEHUB_TEMP_DIR}/latest.sql.gz"
  download_latest_database "${archive}"

  log "Pulling Git changes with fast-forward-only policy."
  git_repo pull --ff-only

  local safety_dir safety_archive timestamp
  safety_dir="${BACKUP_DIR}/pre-restore"
  mkdir -p "${safety_dir}"
  timestamp="$(date -u +'%Y-%m-%dT%H%M%SZ')"
  safety_archive="${safety_dir}/pre-restore-${timestamp}.sql.gz"
  log "Saving local rollback database backup."
  export_database_archive "${safety_archive}"
  prune_safety_backups "${safety_dir}"

  log "Importing the latest R2 database backup."
  import_database "${archive}"
  log "Copying uploads from R2 without deleting local files."
  copy_uploads_from_r2
  log "Pull complete. Rollback dump: ${safety_archive}"
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  main "$@"
fi
