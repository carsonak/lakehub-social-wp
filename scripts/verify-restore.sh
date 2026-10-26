#!/usr/bin/env bash
# Read-only verification; never imports, changes URLs or rewrites source.
set -Eeuo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"
[[ $# -le 1 ]] || die 'Usage: ./scripts/verify-restore.sh [/absolute/path/to/export.zip]'
archive="${1:-${BACKUP_DIR}/studio-restore/latest.zip}"
validate_studio_export "${archive}"
require_command python3
[[ -f "${archive}.manifest.json" ]] || die 'This legacy export has no source manifest. Validate its checksum and identify its matching Git revision manually before import.'
python3 "${SCRIPT_DIR}/lib/backup_manifest.py" verify "${archive}" --checkout --site "${ROOT_DIR}"
