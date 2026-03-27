#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
CLAUDE_MANIFESTS_DIR="$BASE_DIR/manifests/claude"
DEFAULT_CODEX_MANIFESTS_DIR="$BASE_DIR/manifests/codex"
CODEX_MANIFESTS_DIR="${1:-$DEFAULT_CODEX_MANIFESTS_DIR}"

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

check_deps() {
    if ! command -v jq >/dev/null 2>&1; then
        log_error "jq is required. Install it with your package manager (for example: brew install jq or apt-get install jq)."
        exit 1
    fi
}

build_manifest() {
    local src="$1"
    local dst="$2"

    jq '{
        name,
        description: (.description // ""),
        source_plugin: .name,
        resources: {
            skills: (.resources.skills // []),
            workflows: (.resources.workflows // []),
            templates: (.resources.templates // []),
            scripts: []
        },
        options: {
            include_workflow_wrappers: true,
            include_template_wrappers: true
        }
    }' "$src" > "$dst"
}

build_all_manifest() {
    local dst="$1"
    local tmp="$dst.tmp"

    jq -s '{
        name: "all",
        description: "Build every portable lamella skill, workflow, and template as Codex skills.",
        resources: {
            skills: ([.[].resources.skills[]?] | unique | sort),
            workflows: ([.[].resources.workflows[]?] | unique | sort),
            templates: ([.[].resources.templates[]?] | unique | sort),
            scripts: []
        },
        options: {
            include_workflow_wrappers: true,
            include_template_wrappers: true
        }
    }' \
        "$CLAUDE_MANIFESTS_DIR"/*.json > "$tmp"

    jq '.' "$tmp" > "$dst"
    rm -f "$tmp"
}

main() {
    check_deps
    mkdir -p "$CODEX_MANIFESTS_DIR"
    rm -f "$CODEX_MANIFESTS_DIR"/*.yaml

    local count=0
    local manifest
    for manifest in "$CLAUDE_MANIFESTS_DIR"/*.json; do
        local file_name
        file_name=$(basename "$manifest")
        case "$file_name" in
            schema.json|index.json)
                continue
                ;;
        esac

        local name
        name=$(jq -r '.name // empty' "$manifest")
        [[ -z "$name" ]] && continue

        build_manifest "$manifest" "$CODEX_MANIFESTS_DIR/$name.yaml"
        count=$((count + 1))
    done

    build_all_manifest "$CODEX_MANIFESTS_DIR/all.yaml"

    log_success "Generated $count Codex manifests in $CODEX_MANIFESTS_DIR"
}

main "$@"
