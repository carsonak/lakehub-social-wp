#!/usr/bin/env bash

# Shared helpers for Git and full WordPress Studio exports stored in R2.
# shellcheck disable=SC2034,SC2154,SC2310
set -Eeuo pipefail

SCRIPT_LIB_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "${SCRIPT_LIB_DIR}/../.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env"
RUNTIME_DIR="${ROOT_DIR}/.runtime"
BACKUP_DIR="${ROOT_DIR}/.backups"
STUDIO_EXPORT_PREFIX="studio-exports"
STUDIO_EXPORT_RETENTION=5

log() { printf '[lakehub] %s\n' "$*"; }
warn() { printf '[lakehub] WARNING: %s\n' "$*" >&2; }
die() { printf '[lakehub] ERROR: %s\n' "$*" >&2; exit 1; }

trim() {
  local value="$*"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf '%s' "${value}"
}

load_env() {
  [[ -f "${ENV_FILE}" ]] || die "Missing ${ENV_FILE}. Copy .env.example to .env and add the R2 credentials."
  local mode line key value first last
  mode="$(stat -c '%a' "${ENV_FILE}" 2>/dev/null || true)"
  if [[ "${mode}" != "600" ]]; then
    chmod 600 "${ENV_FILE}"
    log "Restricted .env permissions to 600."
  fi

  while IFS= read -r line || [[ -n "${line}" ]]; do
    line="${line%$'\r'}"
    line="$(trim "${line}")"
    [[ -z "${line}" || "${line}" == \#* ]] && continue
    [[ "${line}" == export\ * ]] && line="$(trim "${line#export }")"
    [[ "${line}" == *=* ]] || die "Malformed line in .env (expected NAME=value)."
    key="$(trim "${line%%=*}")"
    value="$(trim "${line#*=}")"
    [[ "${key}" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] || die "Invalid variable name in .env: ${key}"
    if ((${#value} >= 2)); then
      first="${value:0:1}"
      last="${value: -1}"
      if [[ ("${first}" == "'" && "${last}" == "'") || ("${first}" == '"' && "${last}" == '"') ]]; then
        value="${value:1:${#value}-2}"
      fi
    fi
    if [[ -z "${!key+x}" ]]; then
      export "${key}=${value}"
    fi
  done < "${ENV_FILE}"

  R2_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID:-${ACCESS_KEY_ID:-}}"
  R2_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY:-${SECRET_ACCESS_KEY:-}}"
  R2_ENDPOINT="${R2_ENDPOINT:-${DEFAULT:-}}"
  R2_BUCKET="${R2_BUCKET:-lakehub-social}"
  export R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_ENDPOINT R2_BUCKET
}

require_var() {
  local name="$1"
  [[ -n "${!name:-}" ]] || die "Required setting ${name} is missing from .env."
}

require_settings() {
  local name
  for name in R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_ENDPOINT R2_BUCKET; do
    require_var "${name}"
  done
  [[ "${R2_ENDPOINT}" == https://*.r2.cloudflarestorage.com ]] || die "R2_ENDPOINT must be a Cloudflare R2 HTTPS S3 endpoint."
  [[ "${R2_BUCKET}" =~ ^[a-z0-9][a-z0-9.-]*[a-z0-9]$ ]] || die "R2_BUCKET is not a valid bucket name."
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || die "Required command not found: $1"
}

configure_rclone() {
  export RCLONE_CONFIG_R2_TYPE=s3
  export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
  export RCLONE_CONFIG_R2_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID}"
  export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY}"
  export RCLONE_CONFIG_R2_ENDPOINT="${R2_ENDPOINT}"
  export RCLONE_CONFIG_R2_REGION=auto
  export RCLONE_CONFIG_R2_NO_CHECK_BUCKET=true
}

r2_path() {
  local suffix="${1#/}"
  printf 'r2:%s/%s' "${R2_BUCKET}" "${suffix}"
}

check_r2() {
  configure_rclone
  rclone lsf "r2:${R2_BUCKET}" --max-depth 1 >/dev/null || die "Cannot access R2 bucket ${R2_BUCKET}. Check .env credentials and endpoint."
}

validate_studio_export() {
  local archive="$1" listing
  [[ -f "${archive}" ]] || die "Studio export not found: ${archive}"
  [[ "${archive}" == *.zip ]] || die "Expected a full WordPress Studio .zip export."
  unzip -tq "${archive}" >/dev/null || die "Studio export is corrupt: ${archive}"
  listing="$(unzip -Z1 "${archive}")"
  grep -Eq '^sql/[^/]+\.sql$' <<<"${listing}" || die "Studio export has no SQL payload."
  grep -Eq '^wp-content/plugins/' <<<"${listing}" || die "Studio export has no plugins."
  grep -Eq '^wp-content/themes/' <<<"${listing}" || die "Studio export has no themes."
  grep -Eq '^wp-content/uploads/' <<<"${listing}" || die "Studio export has no uploads."
  grep -qx 'meta.json' <<<"${listing}" || die "Studio export has no meta.json."
}

write_checksum() {
  local archive="$1" checksum_file="$2"
  sha256sum "${archive}" | awk '{print $1}' > "${checksum_file}"
}

verify_checksum() {
  local archive="$1" checksum_file="$2" expected actual
  expected="$(awk 'NR == 1 {print $1}' "${checksum_file}")"
  actual="$(sha256sum "${archive}" | awk '{print $1}')"
  [[ -n "${expected}" && "${expected}" == "${actual}" ]] || die "Checksum validation failed for ${archive}."
}

upload_studio_export() {
  local archive="$1" remote_name="$2" checksum_file local_checksum remote_checksum remote_sha_tmp
  checksum_file="${archive}.sha256"

  log "Computing and verifying SHA256 checksum before upload..."
  write_checksum "${archive}" "${checksum_file}"
  verify_checksum "${archive}" "${checksum_file}"
  local_checksum="$(awk 'NR == 1 {print $1}' "${checksum_file}")"

  remote_sha_tmp="${checksum_file}.remote"
  if rclone copyto "$(r2_path "${STUDIO_EXPORT_PREFIX}/latest.zip.sha256")" "${remote_sha_tmp}" --no-traverse 2>/dev/null; then
    remote_checksum="$(awk 'NR == 1 {print $1}' "${remote_sha_tmp}")"
    rm -f "${remote_sha_tmp}"
    if [[ -n "${remote_checksum}" && "${local_checksum}" == "${remote_checksum}" ]]; then
      log "Notice: Remote latest.zip already has identical SHA256 (${local_checksum:0:12})."
    fi
  fi

  log "Uploading ${remote_name} to R2..."
  rclone copyto "${archive}" "$(r2_path "${STUDIO_EXPORT_PREFIX}/${remote_name}")" --no-traverse
  rclone copyto "${checksum_file}" "$(r2_path "${STUDIO_EXPORT_PREFIX}/${remote_name}.sha256")" --no-traverse

  log "Updating latest.zip in R2 via server-side copy..."
  rclone copyto "$(r2_path "${STUDIO_EXPORT_PREFIX}/${remote_name}")" "$(r2_path "${STUDIO_EXPORT_PREFIX}/latest.zip")"
  rclone copyto "$(r2_path "${STUDIO_EXPORT_PREFIX}/${remote_name}.sha256")" "$(r2_path "${STUDIO_EXPORT_PREFIX}/latest.zip.sha256")"
}

prune_studio_exports() {
  local -a names=()
  local name
  mapfile -t names < <(rclone lsf "$(r2_path "${STUDIO_EXPORT_PREFIX}")" --files-only | grep -E '^lakehub-social-studio-[0-9]{8}T[0-9]{6}Z\.zip$' | sort -r)
  if (("${#names[@]}" > STUDIO_EXPORT_RETENTION)); then
    for name in "${names[@]:STUDIO_EXPORT_RETENTION}"; do
      rclone deletefile "$(r2_path "${STUDIO_EXPORT_PREFIX}/${name}")"
      rclone deletefile "$(r2_path "${STUDIO_EXPORT_PREFIX}/${name}.sha256")" || true
    done
  fi
}

download_latest_studio_export() {
  local destination="$1" checksum_file remote_checksum local_checksum temp_checksum
  checksum_file="${destination}.sha256"
  temp_checksum="${checksum_file}.remote"

  log "Checking remote checksum for latest Studio export."
  rclone copyto "$(r2_path "${STUDIO_EXPORT_PREFIX}/latest.zip.sha256")" "${temp_checksum}" --no-traverse || die "The Studio export checksum is missing in R2."
  remote_checksum="$(awk 'NR == 1 {print $1}' "${temp_checksum}")"

  if [[ -f "${destination}" && -f "${checksum_file}" ]]; then
    local_checksum="$(awk 'NR == 1 {print $1}' "${checksum_file}")"
    if [[ -n "${remote_checksum}" && "${remote_checksum}" == "${local_checksum}" ]] && verify_checksum "${destination}" "${checksum_file}" 2>/dev/null; then
      log "Local latest Studio export is already up to date (${remote_checksum:0:12}). Skipping archive download."
      rm -f "${temp_checksum}"
      validate_studio_export "${destination}"
      return 0
    fi
  fi

  log "Downloading latest full Studio export from R2."
  rclone copyto "$(r2_path "${STUDIO_EXPORT_PREFIX}/latest.zip")" "${destination}" --no-traverse || die "No Studio latest.zip backup exists in R2."
  mv "${temp_checksum}" "${checksum_file}"
  verify_checksum "${destination}" "${checksum_file}"
  validate_studio_export "${destination}"
}

require_git_repository() {
  git_repo rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "${ROOT_DIR} is not a Git repository."
  git_repo remote get-url origin >/dev/null 2>&1 || die "Git remote 'origin' is not configured."
}

git_repo() {
  if [[ -f "${ROOT_DIR}/.git/HEAD" ]]; then
    git -C "${ROOT_DIR}" "$@"
  elif [[ -f "${RUNTIME_DIR}/git/HEAD" ]]; then
    git --git-dir="${RUNTIME_DIR}/git" --work-tree="${ROOT_DIR}" "$@"
  else
    git -C "${ROOT_DIR}" "$@"
  fi
}
