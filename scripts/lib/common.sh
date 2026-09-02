#!/usr/bin/env bash

# Shared variables are populated by load_env and consumed by sourced entrypoints.
# shellcheck disable=SC2034,SC2154,SC2310
set -Eeuo pipefail

SCRIPT_LIB_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "${SCRIPT_LIB_DIR}/../.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env"
RUNTIME_DIR="${ROOT_DIR}/.runtime"
BACKUP_DIR="${ROOT_DIR}/.backups"
LOCAL_BIN="${HOME}/.local/bin"

export PATH="${LOCAL_BIN}:${HOME}/.pixi/bin:${HOME}/.pixi/envs/lakehub-wordpress/bin:${PATH}"

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
  [[ -f "${ENV_FILE}" ]] || die "Missing ${ENV_FILE}. Copy .env.example to .env and fill in its values."
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

  # Backward-compatible aliases for the names initially supplied in this project.
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
  for name in R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_ENDPOINT R2_BUCKET DB_NAME DB_USER DB_PASSWORD DB_HOST AUTH_KEY SECURE_AUTH_KEY LOGGED_IN_KEY NONCE_KEY AUTH_SALT SECURE_AUTH_SALT LOGGED_IN_SALT NONCE_SALT WP_CACHE_KEY_SALT; do
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

check_wp_database() {
  (cd "${ROOT_DIR}" && wp db check --quiet >/dev/null 2>&1)
}

database_is_local_fallback() {
  [[ "${DB_HOST}" == 127.0.0.1:* ]]
}

mysql_runtime_paths() {
  MYSQL_RUNTIME_DIR="${MYSQL_RUNTIME_DIR:-${RUNTIME_DIR}/mysql}"
  MYSQL_DATA_DIR="${MYSQL_RUNTIME_DIR}/data"
  MYSQL_SOCKET="${MYSQL_RUNTIME_DIR}/mysql.sock"
  MYSQL_PID_FILE="${MYSQL_RUNTIME_DIR}/mysql.pid"
  MYSQL_LOG_FILE="${MYSQL_RUNTIME_DIR}/mysql.log"
  LOCAL_MYSQL_PORT="${LOCAL_MYSQL_PORT:-${DB_HOST##*:}}"
  [[ "${LOCAL_MYSQL_PORT}" =~ ^[0-9]+$ ]] || die "LOCAL_MYSQL_PORT must be numeric."
}

sql_quote() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\'/\'\'}"
  printf '%s' "${value}"
}

initialize_local_mysql() {
  mysql_runtime_paths
  [[ "${DB_NAME}" =~ ^[A-Za-z0-9_]+$ ]] || die "DB_NAME may contain only letters, numbers, and underscores for local setup."
  [[ "${DB_USER}" =~ ^[A-Za-z0-9_]+$ ]] || die "DB_USER may contain only letters, numbers, and underscores for local setup."
  mkdir -p "${MYSQL_RUNTIME_DIR}"
  chmod 700 "${MYSQL_RUNTIME_DIR}"

  if [[ ! -d "${MYSQL_DATA_DIR}/mysql" ]]; then
    log "Initializing project-local MySQL data directory."
    mkdir -p "${MYSQL_DATA_DIR}"
    mysqld --initialize-insecure --datadir="${MYSQL_DATA_DIR}" --log-error="${MYSQL_LOG_FILE}"
  fi

  if [[ -f "${MYSQL_PID_FILE}" ]] && kill -0 "$(<"${MYSQL_PID_FILE}")" 2>/dev/null; then
    return
  fi

  rm -f "${MYSQL_SOCKET}" "${MYSQL_PID_FILE}"
  log "Starting project-local MySQL on 127.0.0.1:${LOCAL_MYSQL_PORT}."
  mysqld --datadir="${MYSQL_DATA_DIR}" --socket="${MYSQL_SOCKET}" --pid-file="${MYSQL_PID_FILE}" --port="${LOCAL_MYSQL_PORT}" --bind-address=127.0.0.1 --log-error="${MYSQL_LOG_FILE}" --daemonize

  local _attempt
  for _attempt in {1..30}; do
    mysqladmin --protocol=socket --socket="${MYSQL_SOCKET}" -uroot ping >/dev/null 2>&1 && break
    sleep 1
  done
  mysqladmin --protocol=socket --socket="${MYSQL_SOCKET}" -uroot ping >/dev/null 2>&1 || die "Local MySQL failed to start; inspect ${MYSQL_LOG_FILE}."

  local escaped_password
  escaped_password="$(sql_quote "${DB_PASSWORD}")"
  mysql --protocol=socket --socket="${MYSQL_SOCKET}" -uroot <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${escaped_password}';
ALTER USER '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${escaped_password}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL
}

ensure_database() {
  check_wp_database && return
  database_is_local_fallback || die "WordPress cannot reach DB_HOST=${DB_HOST}; automatic fallback is allowed only for 127.0.0.1:PORT."
  initialize_local_mysql
  check_wp_database || die "MySQL is running, but WordPress still cannot access the configured database."
}

download_latest_database() {
  local destination="$1"
  rclone copyto "$(r2_path database/latest.sql.gz)" "${destination}" --no-traverse || die "No database/latest.sql.gz backup exists in R2. Run push.sh from the authoritative installation first."
  gzip -t "${destination}" || die "The downloaded database backup is corrupt."
}

import_database() {
  local archive="$1"
  gzip -dc "${archive}" | (cd "${ROOT_DIR}" && wp db import -)
}

export_database_archive() {
  local archive="$1"
  local sql_file="${archive%.gz}"
  (cd "${ROOT_DIR}" && wp db export "${sql_file}" --add-drop-table --quiet)
  gzip -9 "${sql_file}"
  gzip -t "${archive}"
}

copy_uploads_to_r2() {
  mkdir -p "${ROOT_DIR}/wp-content/uploads"
  rclone copy "${ROOT_DIR}/wp-content/uploads" "$(r2_path uploads)" --create-empty-src-dirs
}

copy_uploads_from_r2() {
  mkdir -p "${ROOT_DIR}/wp-content/uploads"
  rclone copy "$(r2_path uploads)" "${ROOT_DIR}/wp-content/uploads" --create-empty-src-dirs
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
