#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="${1:-$BASE_DIR/dist/generated/claude-subagents}"

node "$BASE_DIR/scripts/build/emit-subagents.js" claude "$OUTPUT_DIR"
