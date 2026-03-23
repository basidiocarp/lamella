#!/usr/bin/env bash
#
# build-marketplace.sh - Build all Skill-Issue plugins into a Claude Code marketplace
#
# Builds every Claude manifest in manifests/claude/ and generates a marketplace.json
# so the dist/claude directory can be used as a local Claude Code plugin marketplace.
#
# Usage:
#   ./build-marketplace.sh [output-dir]
#
# Default output: dist/claude
#
# Install the marketplace:
#   /plugin marketplace add ./dist/claude
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
BUILD_SCRIPT="$SCRIPT_DIR/build-plugin.sh"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

check_deps() {
    if ! command -v jq &>/dev/null; then
        log_error "jq is required. Install with: brew install jq"
        exit 1
    fi
    if [[ ! -x "$BUILD_SCRIPT" ]]; then
        log_error "build-plugin.sh not found or not executable at: $BUILD_SCRIPT"
        exit 1
    fi
}

build_marketplace() {
    local output_dir="${1:-$BASE_DIR/dist/claude}"
    local manifests_dir="$BASE_DIR/manifests/claude"
    local plugins_dir="$output_dir/plugins"

    echo -e "${BOLD}Building Skill-Issue Marketplace${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Clean output
    rm -rf "$output_dir"
    mkdir -p "$plugins_dir"

    local built=0
    local failed=0
    local plugin_entries=""

    # Build each plugin
    for manifest in "$manifests_dir"/*.json; do
        local basename_file
        basename_file=$(basename "$manifest")

        # Skip non-plugin files
        [[ "$basename_file" == "schema.json" ]] && continue
        [[ "$basename_file" == "index.json" ]] && continue

        local name
        name=$(jq -r '.name // empty' "$manifest")
        [[ -z "$name" ]] && continue

        local description version
        description=$(jq -r '.description // ""' "$manifest")
        version=$(jq -r '.version // "1.0.0"' "$manifest")

        if bash "$BUILD_SCRIPT" "$manifest" "$plugins_dir/$name" 2>&1 | sed 's/^/  /'; then
            built=$((built + 1))

            # Build marketplace plugin entry
            local entry
            entry=$(jq -n \
                --arg name "$name" \
                --arg source "./plugins/$name" \
                --arg desc "$description" \
                --arg ver "$version" \
                '{
                    name: $name,
                    source: $source,
                    description: $desc,
                    version: $ver
                }')

            if [[ -z "$plugin_entries" ]]; then
                plugin_entries="$entry"
            else
                plugin_entries="$plugin_entries,$entry"
            fi
        else
            log_error "Failed to build: $name"
            failed=$((failed + 1))
        fi

        echo ""
    done

    # Generate marketplace.json
    mkdir -p "$output_dir/.claude-plugin"
    echo "{
  \"name\": \"lamella\",
  \"owner\": {
    \"name\": \"William Newton\"
  },
  \"metadata\": {
    \"description\": \"Skill-Issue — curated skills, agents, and commands for Claude Code\",
    \"version\": \"1.0.0\",
    \"pluginRoot\": \"./plugins\"
  },
  \"plugins\": [
    $(echo "$plugin_entries" | sed 's/},{/},\n    {/g')
  ]
}" | jq '.' > "$output_dir/.claude-plugin/marketplace.json"

    log_success "Generated marketplace.json"

    # Clear Claude Code plugin cache to prevent stale versions
    local cache_dir="${CLAUDE_CACHE_DIR:-${CLAUDE_HOME:-$HOME/.claude}/plugins/cache/lamella}"
    if [[ -d "$cache_dir" ]]; then
        rm -rf "$cache_dir" 2>/dev/null && \
            log_success "Cleared plugin cache ($cache_dir)" || \
            log_warn "Could not clear plugin cache at $cache_dir"
        log_info "Restart Claude Code to pick up rebuilt plugins."
    fi

    # Summary
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BOLD}Marketplace Build Complete${NC}"
    echo -e "  Plugins built: ${GREEN}$built${NC}"
    if [[ $failed -gt 0 ]]; then
        echo -e "  Failed:        ${RED}$failed${NC}"
    fi
    echo -e "  Output:        $output_dir"
    echo ""
    echo -e "${BOLD}Install the marketplace:${NC}"
    echo "  /plugin marketplace add $output_dir"
    echo ""
    echo -e "${BOLD}Or load a single plugin for testing:${NC}"
    echo "  claude --plugin-dir $plugins_dir/<name>"
    echo ""

    if [[ $failed -gt 0 ]]; then
        return 1
    fi
    return 0
}

main() {
    check_deps
    build_marketplace "${1:-}"
}

main "$@"
