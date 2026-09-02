#!/usr/bin/env bash

# shellcheck disable=SC2310
set -Eeuo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

main() {
  [[ $# -eq 1 && -n "$1" ]] || die 'Usage: ./scripts/push.sh "commit message"'
  local commit_message="$1"

  load_env
  require_settings
  require_command wp
  require_command rclone
  require_command gzip
  require_git_repository
  ensure_database
  check_r2

  if ! git_repo diff --quiet; then
    warn "Unstaged tracked changes will not be committed."
    git_repo diff --name-only >&2
  fi

  if git_repo diff --cached --quiet; then
    log "No staged changes to commit; continuing with data backup and existing commits."
  else
    git_repo commit -m "${commit_message}"
  fi

  local temp_dir timestamp archive
  temp_dir="$(mktemp -d)"
  trap 'rm -rf "${temp_dir}"' EXIT
  timestamp="$(date -u +'%Y-%m-%dT%H%M%SZ')"
  archive="${temp_dir}/lakehub-social-${timestamp}.sql.gz"

  log "Exporting and validating the database."
  export_database_archive "${archive}"
  log "Copying uploads to R2 without remote deletions."
  copy_uploads_to_r2
  log "Uploading timestamped and latest database backups."
  rclone copyto "${archive}" "$(r2_path "database/$(basename "${archive}")")" --no-traverse
  rclone copyto "${archive}" "$(r2_path database/latest.sql.gz)" --no-traverse

  local branch
  branch="$(git_repo branch --show-current)"
  [[ -n "${branch}" ]] || die "Cannot push from a detached HEAD."
  log "Pushing ${branch} to GitHub."
  git_repo push --set-upstream origin "${branch}"
  log "Backup complete: database/$(basename "${archive}"), uploads/, and Git branch ${branch}."
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  main "$@"
fi
