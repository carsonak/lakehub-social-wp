#!/usr/bin/env bash

set -Eeuo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

WP_CLI_VERSION=2.12.0
RCLONE_VERSION=1.71.2

install_profile_path() {
  local profile="${HOME}/.profile"
  local marker='# LakeHub WordPress user tools'
  touch "${profile}"
  if ! grep -Fq "${marker}" "${profile}"; then
    {
      printf '\n%s\n' "${marker}"
      # shellcheck disable=SC2016
      printf 'export PATH="$HOME/.local/bin:$HOME/.pixi/bin:$HOME/.pixi/envs/lakehub-wordpress/bin:$PATH"\n'
    } >> "${profile}"
  fi
}

install_pixi() {
  if command -v pixi >/dev/null 2>&1; then
    return
  fi
  log "Installing Pixi in the user account."
  curl -fsSL https://pixi.sh/install.sh | bash
  export PATH="${HOME}/.pixi/bin:${PATH}"
  require_command pixi
}

install_runtime_if_needed() {
  local need_php=false need_mysql=false
  if ! command -v php >/dev/null 2>&1 || ! php -r 'exit(version_compare(PHP_VERSION, "7.4", ">=") && extension_loaded("mysqli") ? 0 : 1);'; then
    need_php=true
  fi
  local tool
  for tool in mysql mysqld mysqldump mysqladmin; do
    command -v "${tool}" >/dev/null 2>&1 || need_mysql=true
  done

  if [[ "${need_php}" == true || "${need_mysql}" == true ]]; then
    install_pixi
    local packages=()
    [[ "${need_php}" == true ]] && packages+=("php=8.4.*")
    [[ "${need_mysql}" == true ]] && packages+=("mysql=8.4.2")
    log "Installing missing runtime packages without sudo."
    pixi global install --environment lakehub-wordpress "${packages[@]}"
    export PATH="${HOME}/.pixi/envs/lakehub-wordpress/bin:${HOME}/.pixi/bin:${PATH}"
  fi

  require_command php
  require_command mysql
  require_command mysqld
  require_command mysqldump
  require_command mysqladmin
}

install_wp_cli() {
  if command -v wp >/dev/null 2>&1 && [[ "$(wp --version 2>/dev/null)" == "WP-CLI ${WP_CLI_VERSION}" ]]; then
    return
  fi
  mkdir -p "${LOCAL_BIN}"
  local temp_dir phar checksum_file expected actual
  temp_dir="$(mktemp -d)"
  log "Installing WP-CLI ${WP_CLI_VERSION} in ${LOCAL_BIN}."
  phar="wp-cli-${WP_CLI_VERSION}.phar"
  checksum_file="${phar}.sha512"
  curl -fsSL "https://github.com/wp-cli/wp-cli/releases/download/v${WP_CLI_VERSION}/${phar}" -o "${temp_dir}/wp"
  curl -fsSL "https://github.com/wp-cli/wp-cli/releases/download/v${WP_CLI_VERSION}/${checksum_file}" -o "${temp_dir}/wp.sha512"
  expected="$(awk '{print $1}' "${temp_dir}/wp.sha512")"
  actual="$(sha512sum "${temp_dir}/wp" | awk '{print $1}')"
  [[ -n "${expected}" && "${expected}" == "${actual}" ]] || die "WP-CLI checksum verification failed."
  install -m 0755 "${temp_dir}/wp" "${LOCAL_BIN}/wp"
  rm -rf "${temp_dir}"
}

install_rclone() {
  if command -v rclone >/dev/null 2>&1; then
    return
  fi
  require_command unzip
  mkdir -p "${LOCAL_BIN}"
  local temp_dir archive expected actual
  temp_dir="$(mktemp -d)"
  archive="rclone-v${RCLONE_VERSION}-linux-amd64.zip"
  log "Installing rclone ${RCLONE_VERSION} in ${LOCAL_BIN}."
  curl -fsSL "https://downloads.rclone.org/v${RCLONE_VERSION}/${archive}" -o "${temp_dir}/${archive}"
  curl -fsSL "https://downloads.rclone.org/v${RCLONE_VERSION}/SHA256SUMS" -o "${temp_dir}/SHA256SUMS"
  expected="$(awk -v file="${archive}" '$2 == file {print $1}' "${temp_dir}/SHA256SUMS")"
  actual="$(sha256sum "${temp_dir}/${archive}" | awk '{print $1}')"
  [[ -n "${expected}" && "${expected}" == "${actual}" ]] || die "rclone checksum verification failed."
  unzip -q "${temp_dir}/${archive}" -d "${temp_dir}"
  install -m 0755 "${temp_dir}/rclone-v${RCLONE_VERSION}-linux-amd64/rclone" "${LOCAL_BIN}/rclone"
  rm -rf "${temp_dir}"
}

main() {
  [[ "$(uname -s)" == Linux && "$(uname -m)" == x86_64 ]] || die "setup.sh currently supports Linux x86_64 only."
  require_command git
  require_command curl
  require_command tar
  require_command gzip
  require_command sha256sum

  load_env
  require_settings
  install_profile_path
  install_runtime_if_needed
  install_wp_cli
  install_rclone
  check_r2
  ensure_database

  local temp_dir archive
  temp_dir="$(mktemp -d)"
  trap 'rm -rf "${temp_dir}"' EXIT
  archive="${temp_dir}/latest.sql.gz"
  download_latest_database "${archive}"
  log "Importing the latest R2 database backup."
  import_database "${archive}"
  log "Copying uploads from R2 without deleting local files."
  copy_uploads_from_r2
  log "Setup complete. Open a new shell or run: source ~/.profile"
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  main "$@"
fi
