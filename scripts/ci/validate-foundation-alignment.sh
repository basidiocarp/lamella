#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

check() {
  local pattern="$1"
  shift
  if ! rg -q "$pattern" "$@"; then
    printf 'foundation alignment check failed: missing pattern %s in %s\n' "$pattern" "$*" >&2
    exit 1
  fi
}

check 'packag|authoring|manifest' \
  "$ROOT/README.md" \
  "$ROOT/CLAUDE.md" \
  "$ROOT/AGENTS.md" \
  "$ROOT/docs/README.md" \
  "$ROOT/docs/architecture.md"

check 'stipe|runtime|repair|host' \
  "$ROOT/README.md" \
  "$ROOT/CLAUDE.md" \
  "$ROOT/AGENTS.md" \
  "$ROOT/docs/README.md" \
  "$ROOT/docs/architecture.md"

check 'source of truth|dist/|generated output|disposable output' \
  "$ROOT/README.md" \
  "$ROOT/CLAUDE.md" \
  "$ROOT/AGENTS.md" \
  "$ROOT/docs/README.md" \
  "$ROOT/docs/architecture.md"
