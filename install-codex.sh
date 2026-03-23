#!/usr/bin/env bash
#
# Thin compatibility wrapper for Codex skill installs.
#
# Preferred entrypoint:
#   ./lamella install-codex [options]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

exec bash "$SCRIPT_DIR/builders/install-codex-skills.sh" "$@"
