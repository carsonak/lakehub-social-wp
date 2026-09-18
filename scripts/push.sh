#!/usr/bin/env bash

# ==============================================================================
# LakeHub Social WordPress - Push and Backup Script
# ==============================================================================
# Automates the verification, staging, committing, Cloudflare R2 backup, and Git
# push workflow for the LakeHub Social site.
#
# Usage:
#   ./scripts/push.sh "commit message" /absolute/path/to/studio-export.zip
#
# Workflow:
#   1. Validates prerequisites (environment, rclone, unzip, sha256sum, Git repo).
#   2. Validates the provided full WordPress Studio export ZIP.
#   3. Stages project-owned agent instructions and skills (.codex/skills, AGENTS.md).
#   4. Commits staged changes (if any) using the provided commit message.
#   5. Computes SHA256 checksum and uploads the export to Cloudflare R2 as both a
#      timestamped object and latest.zip (skipping upload if remote matches).
#   6. Prunes old timestamped exports in R2 to maintain the retention policy.
#   7. Pushes the current Git branch to origin.
#
# shellcheck disable=SC2310
set -Eeuo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

# Stages project-owned Codex skills and AGENTS.md so agent instructions
# and skill definitions are tracked and versioned in Git alongside codebase changes.
stage_agent_assets() {
  log "Staging project-owned Codex skills and AGENTS.md."
  git_repo add -A -- .codex/skills AGENTS.md
}

# Main execution entrypoint for the push and backup script.
# Arguments:
#   $1 - Git commit message.
#   $2 - Absolute path to a full WordPress Studio export ZIP archive.
# Exits:
#   Terminates if arguments are missing/invalid, prerequisites fail, or push fails.
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
