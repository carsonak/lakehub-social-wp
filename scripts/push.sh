#!/usr/bin/env bash

# shellcheck disable=SC2310
set -Eeuo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

stage_agent_assets() {
  log "Staging project-owned Codex skills and AGENTS.md."
  git_repo add -A -- .codex/skills AGENTS.md
}

main() {
  [[ $# -eq 2 && -n "$1" && -n "$2" ]] || die 'Usage: ./scripts/push.sh "commit message" /absolute/path/to/studio-export.zip'
  local commit_message="$1" archive="$2" timestamp remote_name branch
  [[ "${archive}" == /* ]] || die "Studio export path must be absolute."

  load_env
  require_settings
  require_command rclone
  require_command unzip
  require_command sha256sum
  require_git_repository
  validate_studio_export "${archive}"
  check_r2
  stage_agent_assets

  if ! git_repo diff --quiet; then
    warn "Unstaged tracked changes will not be committed."
    git_repo diff --name-only >&2
  fi
  if git_repo diff --cached --quiet; then
    log "No staged changes to commit; continuing with the export backup and existing commits."
  else
    git_repo commit -m "${commit_message}"
  fi

  timestamp="$(date -u +'%Y%m%dT%H%M%SZ')"
  remote_name="lakehub-social-studio-${timestamp}.zip"
  log "Uploading the validated Studio export as ${remote_name} and latest.zip."
  upload_studio_export "${archive}" "${remote_name}"
  prune_studio_exports

  branch="$(git_repo branch --show-current)"
  [[ -n "${branch}" ]] || die "Cannot push from a detached HEAD."
  log "Pushing ${branch} to GitHub."
  git_repo push --set-upstream origin "${branch}"
  log "Backup complete: ${STUDIO_EXPORT_PREFIX}/${remote_name}, latest.zip, checksums, and Git branch ${branch}."
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  main "$@"
fi
