#!/usr/bin/env bash
#
# build-marketplace.sh - Build all Lamella plugins into a Claude Code marketplace
#
# Builds every Claude manifest in manifests/claude/ and generates a marketplace.json
# so the dist/claude directory can be used as a local Claude Code plugin marketplace.
#
# Usage:
#   ./build-marketplace.sh [options] [output-dir]
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
VERSION_FILE="$BASE_DIR/VERSION"
VALIDATE_BUILD_SCRIPT="$BASE_DIR/scripts/ci/validate-build.js"

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

MARKETPLACE_NAME="lamella"
MARKETPLACE_OWNER="William Newton"
MARKETPLACE_DESCRIPTION="Lamella — curated skills, agents, and commands for Claude Code"
DEFAULT_BUILD_VERSION="1.0.0"
if [[ -f "$VERSION_FILE" ]]; then
    DEFAULT_BUILD_VERSION="$(tr -d '[:space:]' < "$VERSION_FILE")"
fi

MARKETPLACE_VERSION="$DEFAULT_BUILD_VERSION"
PLUGIN_VERSION="$DEFAULT_BUILD_VERSION"
SOURCE_MODE="local"
GIT_SOURCE_URL=""
GIT_SOURCE_REF=""
OUTPUT_DIR=""
CATALOG_ONLY=false
semver_regex='^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$'

usage() {
    cat <<EOF
Usage: $0 [options] [output-dir]

Build every Claude manifest into a Claude Code marketplace.

Options:
  --output-dir <dir>     Output directory (default: dist/claude)
  --marketplace-name <name>
                         Marketplace identifier (default: lamella)
  --owner-name <name>    Marketplace owner name
  --description <text>   Marketplace description
  --version <version>    Marketplace version
  --plugin-version <v>   Version stamped into built plugin.json files and entries
  --source-mode <mode>   Plugin source mode: local | git-subdir
  --git-url <url>        Git URL used for hosted plugin sources
  --git-ref <ref>        Git branch/tag used for hosted plugin sources
  --catalog-only         Write marketplace.json only; skip building plugin dirs
  -h, --help             Show this help

Notes:
  local      Produces a local git/path marketplace with ./plugins/<name> entries.
  git-subdir Produces a URL-safe marketplace manifest where each plugin points
             to a git subdirectory source. Use this when hosting marketplace.json
             at a URL such as GitHub Pages.
EOF
}

check_deps() {
    if ! command -v jq &>/dev/null; then
        log_error "jq is required. Install it with your package manager (for example: brew install jq or apt-get install jq)."
        exit 1
    fi
    if [[ ! -x "$BUILD_SCRIPT" ]]; then
        log_error "build-plugin.sh not found or not executable at: $BUILD_SCRIPT"
        exit 1
    fi
}

is_semver() {
    local version="$1"
    [[ "$version" =~ $semver_regex ]]
}

clear_output_dir() {
    local output_dir="$1"

    rm -rf "$output_dir" 2>/dev/null || true
    if [[ -e "$output_dir" ]]; then
        find "$output_dir" -mindepth 1 -exec rm -rf {} + 2>/dev/null || true
        rmdir "$output_dir" 2>/dev/null || true
    fi

    if [[ -e "$output_dir" ]]; then
        log_error "Could not clear output directory: $output_dir"
        exit 1
    fi
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --output-dir)
                OUTPUT_DIR="$2"
                shift 2
                ;;
            --marketplace-name)
                MARKETPLACE_NAME="$2"
                shift 2
                ;;
            --owner-name)
                MARKETPLACE_OWNER="$2"
                shift 2
                ;;
            --description)
                MARKETPLACE_DESCRIPTION="$2"
                shift 2
                ;;
            --version)
                MARKETPLACE_VERSION="$2"
                shift 2
                ;;
            --plugin-version)
                PLUGIN_VERSION="$2"
                shift 2
                ;;
            --source-mode)
                SOURCE_MODE="$2"
                shift 2
                ;;
            --git-url)
                GIT_SOURCE_URL="$2"
                shift 2
                ;;
            --git-ref)
                GIT_SOURCE_REF="$2"
                shift 2
                ;;
            --catalog-only)
                CATALOG_ONLY=true
                shift
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            -*)
                log_error "Unknown option: $1"
                usage
                exit 1
                ;;
            *)
                if [[ -n "$OUTPUT_DIR" ]]; then
                    log_error "Unexpected extra argument: $1"
                    usage
                    exit 1
                fi
                OUTPUT_DIR="$1"
                shift
                ;;
        esac
    done
}

validate_config() {
    if ! is_semver "$MARKETPLACE_VERSION"; then
        log_error "Invalid marketplace version: $MARKETPLACE_VERSION"
        exit 1
    fi

    if ! is_semver "$PLUGIN_VERSION"; then
        log_error "Invalid plugin version: $PLUGIN_VERSION"
        exit 1
    fi

    case "$SOURCE_MODE" in
        local)
            if $CATALOG_ONLY; then
                log_error "--catalog-only requires a non-local source mode"
                exit 1
            fi
            ;;
        git-subdir)
            if [[ -z "$GIT_SOURCE_URL" ]]; then
                log_error "--git-url is required when --source-mode git-subdir is used"
                exit 1
            fi
            if [[ -z "$GIT_SOURCE_REF" ]]; then
                log_error "--git-ref is required when --source-mode git-subdir is used"
                exit 1
            fi
            ;;
        *)
            log_error "Unsupported source mode: $SOURCE_MODE"
            usage
            exit 1
            ;;
    esac
}

plugin_entry_json() {
    local name="$1"
    local description="$2"
    local version="$3"

    case "$SOURCE_MODE" in
        local)
            jq -n \
                --arg name "$name" \
                --arg source "./plugins/$name" \
                --arg desc "$description" \
                --arg ver "$version" \
                '{
                    name: $name,
                    source: $source,
                    description: $desc,
                    version: $ver
                }'
            ;;
        git-subdir)
            jq -n \
                --arg name "$name" \
                --arg desc "$description" \
                --arg ver "$version" \
                --arg git_url "$GIT_SOURCE_URL" \
                --arg git_ref "$GIT_SOURCE_REF" \
                '{
                    name: $name,
                    source: {
                        source: "git-subdir",
                        url: $git_url,
                        path: ("plugins/" + $name),
                        ref: $git_ref
                    },
                    description: $desc,
                    version: $ver
                }'
            ;;
    esac
}

generate_marketplace_json() {
    local output_dir="$1"
    local plugin_entries="$2"
    local metadata_json=""

    if [[ "$SOURCE_MODE" == "local" ]]; then
        metadata_json=$(jq -n \
            --arg desc "$MARKETPLACE_DESCRIPTION" \
            --arg ver "$MARKETPLACE_VERSION" \
            '{
                description: $desc,
                version: $ver,
                pluginRoot: "./plugins"
            }')
    else
        metadata_json=$(jq -n \
            --arg desc "$MARKETPLACE_DESCRIPTION" \
            --arg ver "$MARKETPLACE_VERSION" \
            '{
                description: $desc,
                version: $ver
            }')
    fi

    jq -n \
        --arg name "$MARKETPLACE_NAME" \
        --arg owner "$MARKETPLACE_OWNER" \
        --argjson metadata "$metadata_json" \
        --argjson plugins "[$plugin_entries]" \
        '{
            name: $name,
            owner: {
                name: $owner
            },
            metadata: $metadata,
            plugins: $plugins
        }' > "$output_dir/.claude-plugin/marketplace.json"
}

write_marketplace_index() {
    local output_dir="$1"

    cat > "$output_dir/index.html" <<EOF
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${MARKETPLACE_NAME} Marketplace</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #0f172a;
      --fg: #e2e8f0;
      --muted: #94a3b8;
      --card: rgba(15, 23, 42, 0.78);
      --accent: #38bdf8;
      --accent-2: #f59e0b;
      --border: rgba(148, 163, 184, 0.18);
    }
    body {
      margin: 0;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at top right, rgba(56, 189, 248, 0.24), transparent 30%),
        radial-gradient(circle at bottom left, rgba(245, 158, 11, 0.18), transparent 30%),
        var(--bg);
      color: var(--fg);
    }
    main {
      max-width: 900px;
      margin: 0 auto;
      padding: 48px 24px 72px;
    }
    h1 {
      margin: 0 0 12px;
      font-size: clamp(2rem, 5vw, 3.25rem);
      line-height: 1.05;
    }
    p {
      color: var(--muted);
      line-height: 1.6;
    }
    .card {
      margin-top: 28px;
      padding: 20px 22px;
      border: 1px solid var(--border);
      border-radius: 18px;
      background: var(--card);
      backdrop-filter: blur(8px);
    }
    code {
      font-family: ui-monospace, SFMono-Regular, SFMono-Regular, Consolas, monospace;
      font-size: 0.95em;
      color: var(--fg);
    }
    a {
      color: var(--accent);
    }
    .meta {
      color: var(--accent-2);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.78rem;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <main>
    <div class="meta">Claude Code Marketplace</div>
    <h1>${MARKETPLACE_NAME}</h1>
    <p>${MARKETPLACE_DESCRIPTION}</p>
    <div class="card">
      <p>Marketplace catalog URL:</p>
      <p><code>./.claude-plugin/marketplace.json</code></p>
      <p>This build is intended for Claude Code marketplace installation and automated updates.</p>
    </div>
  </main>
</body>
</html>
EOF
}

build_marketplace() {
    local output_dir="${1:-$BASE_DIR/dist/claude}"
    local manifests_dir="$BASE_DIR/manifests/claude"
    local plugins_dir="$output_dir/plugins"
    local built_label="Plugins built"

    echo -e "${BOLD}Building Lamella Marketplace${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    if ! $CATALOG_ONLY; then
        # Clean output
        clear_output_dir "$output_dir"
        mkdir -p "$plugins_dir"
    else
        mkdir -p "$output_dir/.claude-plugin"
        built_label="Catalog entries"
    fi

    local built=0
    local failed=0
    local plugin_entries=""

    # Build each plugin in stable plugin-name order.
    while IFS=$'\t' read -r name manifest; do
        [[ -z "$name" ]] && continue

        local description version
        description=$(jq -r '.description // ""' "$manifest")
        version="$PLUGIN_VERSION"

        if $CATALOG_ONLY; then
            local entry
            entry=$(plugin_entry_json "$name" "$description" "$version")
            if [[ -z "$plugin_entries" ]]; then
                plugin_entries="$entry"
            else
                plugin_entries="$plugin_entries,$entry"
            fi
            built=$((built + 1))
        else
            if bash "$BUILD_SCRIPT" --version "$PLUGIN_VERSION" "$manifest" "$plugins_dir/$name" 2>&1 | sed 's/^/  /'; then
                built=$((built + 1))

                local entry
                entry=$(plugin_entry_json "$name" "$description" "$version")

                if [[ -z "$plugin_entries" ]]; then
                    plugin_entries="$entry"
                else
                    plugin_entries="$plugin_entries,$entry"
                fi
            else
                log_error "Failed to build: $name"
                failed=$((failed + 1))
            fi
        fi

        echo ""
    done < <(
        for manifest in "$manifests_dir"/*.json; do
            basename_file=$(basename "$manifest")
            [[ "$basename_file" == "schema.json" ]] && continue
            [[ "$basename_file" == "index.json" ]] && continue

            plugin_name=$(jq -r '.name // empty' "$manifest")
            [[ -z "$plugin_name" ]] && continue

            printf '%s\t%s\n' "$plugin_name" "$manifest"
        done | LC_ALL=C sort -t $'\t' -k1,1
    )

    mkdir -p "$output_dir/.claude-plugin"
    generate_marketplace_json "$output_dir" "$plugin_entries"
    if ! $CATALOG_ONLY; then
        write_marketplace_index "$output_dir"
        node "$VALIDATE_BUILD_SCRIPT"
    fi

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
    echo -e "  ${built_label}: ${GREEN}$built${NC}"
    if [[ $failed -gt 0 ]]; then
        echo -e "  Failed:        ${RED}$failed${NC}"
    fi
    echo -e "  Output:        $output_dir"
    echo -e "  Catalog ver:   $MARKETPLACE_VERSION"
    echo -e "  Plugin ver:    $PLUGIN_VERSION"
    echo ""
    echo -e "${BOLD}Install the marketplace:${NC}"
    echo "  /plugin marketplace add $output_dir"
    echo ""
    if ! $CATALOG_ONLY; then
        echo -e "${BOLD}Or load a single plugin for testing:${NC}"
        echo "  claude --plugin-dir $plugins_dir/<name>"
        echo ""
    fi

    if [[ $failed -gt 0 ]]; then
        return 1
    fi
    return 0
}

main() {
    check_deps
    parse_args "$@"
    validate_config
    build_marketplace "$OUTPUT_DIR"
}

main "$@"
