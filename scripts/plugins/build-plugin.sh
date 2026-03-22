#!/usr/bin/env bash
#
# build-plugin.sh - Build a Skill-Issue manifest into an official Claude Code plugin
#
# Reads a Claude manifest JSON file and generates a self-contained plugin
# directory with .claude-plugin/plugin.json, flattened agents/, commands/,
# skills/, and hooks/hooks.json — matching the official Claude Code plugin spec.
#
# Non-plugin resources (rules, workflows, templates) are placed in _standalone/
# for separate installation via the old copy-to-~/.claude/ path.
#
# Usage:
#   ./build-plugin.sh <manifest.json> [output-dir]
#
# Example:
#   ./build-plugin.sh manifests/claude/core.json
#   ./build-plugin.sh manifests/claude/rust.json dist/claude/plugins/rust
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

usage() {
    echo "Usage: $0 <manifest.json> [output-dir]"
    echo ""
    echo "Builds a Skill-Issue manifest into an official Claude Code plugin."
    echo ""
    echo "Arguments:"
    echo "  manifest.json   Path to plugin manifest (e.g., manifests/claude/core.json)"
    echo "  output-dir      Output directory (default: dist/claude/plugins/<plugin-name>)"
    echo ""
    echo "Output structure:"
    echo "  .claude-plugin/plugin.json   Official manifest"
    echo "  agents/*.md                  Agent definitions"
    echo "  commands/*.md                Command/skill files"
    echo "  skills/*/SKILL.md            Agent skills"
    echo "  hooks/hooks.json             Hook configuration"
    echo "  scripts/hooks/*.js           Hook scripts"
    echo "  _standalone/                 Non-plugin resources"
    exit 1
}

check_deps() {
    if ! command -v jq &>/dev/null; then
        log_error "jq is required. Install with: brew install jq"
        exit 1
    fi
}

json_get() { jq -r "$2 // empty" "$1"; }
json_array() { jq -r "$2 // [] | .[]" "$1"; }

# Copy agents — flatten category/name.md to name.md
copy_agents() {
    local manifest="$1" output_dir="$2"
    local count=0 missing=0

    while IFS= read -r item; do
        [[ -z "$item" ]] && continue
        local src="$BASE_DIR/resources/agents/$item"
        local filename; filename=$(basename "$item")
        local dst="$output_dir/agents/$filename"

        if [[ -f "$src" ]]; then
            mkdir -p "$output_dir/agents"
            cp "$src" "$dst"
            ((count++))
        else
            log_warn "Missing agent: $item"
            ((missing++))
        fi
    done < <(json_array "$manifest" '.resources.agents')

    [[ $count -gt 0 ]] && log_success "  agents: $count files"
    return $missing
}

# Copy commands — flatten category/name.md to name.md
copy_commands() {
    local manifest="$1" output_dir="$2"
    local count=0 missing=0

    while IFS= read -r item; do
        [[ -z "$item" ]] && continue
        local src="$BASE_DIR/resources/commands/$item"
        local filename; filename=$(basename "$item")
        local dst="$output_dir/commands/$filename"

        if [[ -f "$src" ]]; then
            mkdir -p "$output_dir/commands"
            cp "$src" "$dst"
            ((count++))
        else
            log_warn "Missing command: $item"
            ((missing++))
        fi
    done < <(json_array "$manifest" '.resources.commands')

    [[ $count -gt 0 ]] && log_success "  commands: $count files"
    return $missing
}

# Copy skills — flatten category/skill-name/ to skill-name/
copy_skills() {
    local manifest="$1" output_dir="$2"
    local count=0 missing=0

    while IFS= read -r item; do
        [[ -z "$item" ]] && continue
        local src="$BASE_DIR/resources/skills/$item"
        local skill_name; skill_name=$(basename "$item")
        local dst="$output_dir/skills/$skill_name"

        if [[ -d "$src" ]]; then
            mkdir -p "$dst"
            cp -r "$src"/* "$dst"/
            ((count++))
        else
            log_warn "Missing skill: $item"
            ((missing++))
        fi
    done < <(json_array "$manifest" '.resources.skills')

    [[ $count -gt 0 ]] && log_success "  skills: $count directories"
    return $missing
}

# Copy hooks — bundle hook scripts and generate hooks/hooks.json
copy_hooks() {
    local manifest="$1" output_dir="$2"
    local hooks_json="$BASE_DIR/resources/hooks/hooks.json"
    local count=0

    local hook_items
    hook_items=$(json_array "$manifest" '.resources.hooks' 2>/dev/null || true)
    [[ -z "$hook_items" ]] && return 0

    # Copy hooks.json config (already uses ${CLAUDE_PLUGIN_ROOT} paths)
    if [[ -f "$hooks_json" ]]; then
        mkdir -p "$output_dir/hooks"
        jq 'del(."$schema")' "$hooks_json" > "$output_dir/hooks/hooks.json"
        ((count++))
    fi

    # Copy hook scripts referenced in manifest
    mkdir -p "$output_dir/scripts/hooks"
    while IFS= read -r item; do
        [[ -z "$item" ]] && continue
        local src="$BASE_DIR/resources/hooks/$item"
        if [[ -f "$src" ]]; then
            cp "$src" "$output_dir/scripts/hooks/"
            ((count++))
        else
            log_warn "Missing hook script: $item"
        fi
    done <<< "$hook_items"

    # Also copy scripts referenced via ${CLAUDE_PLUGIN_ROOT} in hooks.json
    if [[ -f "$hooks_json" ]]; then
        local referenced
        referenced=$(grep -oE '\$\{CLAUDE_PLUGIN_ROOT\}/scripts/hooks/[a-zA-Z0-9_.-]+' "$hooks_json" \
            | sed 's|${CLAUDE_PLUGIN_ROOT}/scripts/hooks/||' | sort -u || true)
        while IFS= read -r script; do
            [[ -z "$script" ]] && continue
            local src="$BASE_DIR/resources/hooks/$script"
            if [[ -f "$src" ]] && [[ ! -f "$output_dir/scripts/hooks/$script" ]]; then
                cp "$src" "$output_dir/scripts/hooks/"
                ((count++))
            fi
        done <<< "$referenced"

        # Skill-referenced scripts (e.g., continuous-learning hooks)
        # These need to be flattened to match the skill directory flattening
        local skill_refs
        skill_refs=$(grep -oE '\$\{CLAUDE_PLUGIN_ROOT\}/skills/[a-zA-Z0-9/_.-]+' "$hooks_json" | sort -u || true)

        # Build a sed expression to fix skill paths in hooks.json
        local sed_expr=""

        while IFS= read -r ref; do
            [[ -z "$ref" ]] && continue
            local rel_path="${ref/\$\{CLAUDE_PLUGIN_ROOT\}\//}"
            # rel_path = skills/core/continuous-learning/hooks/observe.sh
            # Flatten: strip the category level (skills/CATEGORY/SKILL → skills/SKILL)
            local flattened
            flattened=$(echo "$rel_path" | sed 's|^skills/[^/]*/|skills/|')
            local src="$BASE_DIR/$rel_path"
            if [[ -f "$src" ]]; then
                local dst_dir; dst_dir=$(dirname "$output_dir/$flattened")
                mkdir -p "$dst_dir"
                cp "$src" "$output_dir/$flattened"
                ((count++))
                # Record the path rewrite for hooks.json
                local old_ref="${ref//\//\\/}"
                local new_ref="\${CLAUDE_PLUGIN_ROOT}/$flattened"
                new_ref="${new_ref//\//\\/}"
                if [[ -n "$sed_expr" ]]; then
                    sed_expr="$sed_expr; s|$old_ref|$new_ref|g"
                else
                    sed_expr="s|$old_ref|$new_ref|g"
                fi
            fi
        done <<< "$skill_refs"

        # Apply path rewrites to hooks.json
        if [[ -n "$sed_expr" ]] && [[ -f "$output_dir/hooks/hooks.json" ]]; then
            sed -i '' "$sed_expr" "$output_dir/hooks/hooks.json" 2>/dev/null || \
                sed -i "$sed_expr" "$output_dir/hooks/hooks.json" 2>/dev/null || true
        fi
    fi

    # Copy scripts/lib/ if hook scripts require it (shared utilities)
    if [[ -d "$BASE_DIR/scripts/lib" ]] && [[ -d "$output_dir/scripts/hooks" ]]; then
        local has_lib_require
        has_lib_require=$(grep -rl "require.*\.\./lib" "$output_dir/scripts/hooks/" 2>/dev/null | head -1 || true)
        if [[ -n "$has_lib_require" ]]; then
            cp -r "$BASE_DIR/scripts/lib" "$output_dir/scripts/lib"
            ((count++))
            log_success "  scripts/lib: copied (hook dependency)"
        fi
    fi

    [[ $count -gt 0 ]] && log_success "  hooks: $count files"
    return 0
}

# Copy standalone resources (rules, workflows, templates)
copy_standalone() {
    local manifest="$1" output_dir="$2" resource_type="$3" src_base="$4"
    local count=0 missing=0

    while IFS= read -r item; do
        [[ -z "$item" ]] && continue
        local src="$src_base/$item"
        local dst="$output_dir/_standalone/$resource_type/$item"

        if [[ -e "$src" ]]; then
            mkdir -p "$(dirname "$dst")"
            cp -r "$src" "$dst"
            ((count++))
        else
            log_warn "Missing $resource_type: $item"
            ((missing++))
        fi
    done < <(json_array "$manifest" ".resources.\"$resource_type\"")

    [[ $count -gt 0 ]] && log_success "  $resource_type: $count (standalone)"
    return $missing
}

# Generate .claude-plugin/plugin.json from our manifest
generate_plugin_json() {
    local manifest="$1" output_dir="$2"
    mkdir -p "$output_dir/.claude-plugin"
    jq '{
        name: .name,
        version: .version,
        description: .description,
        author: { name: (.author // "lamella") },
        license: (.license // "MIT"),
        keywords: (.tags // [])
    }' "$manifest" > "$output_dir/.claude-plugin/plugin.json"
}

build_plugin() {
    local manifest="$1" output_dir="$2"

    if [[ ! -f "$manifest" ]]; then
        log_error "Manifest not found: $manifest"
        exit 1
    fi

    local name version
    name=$(json_get "$manifest" ".name")
    version=$(json_get "$manifest" ".version")

    if [[ -z "$name" ]]; then
        log_error "Manifest missing required field: name"
        exit 1
    fi

    [[ -z "$output_dir" ]] && output_dir="$BASE_DIR/dist/claude/plugins/$name"

    log_info "Building plugin: $name v$version"

    rm -rf "$output_dir"
    mkdir -p "$output_dir"

    generate_plugin_json "$manifest" "$output_dir"
    log_success "  .claude-plugin/plugin.json"

    local total_missing=0

    # Official plugin resources
    copy_agents "$manifest" "$output_dir" || ((total_missing += $?))
    copy_commands "$manifest" "$output_dir" || ((total_missing += $?))
    copy_skills "$manifest" "$output_dir" || ((total_missing += $?))
    copy_hooks "$manifest" "$output_dir" || true

    # Copy LSP config if one exists for this plugin
    local lsp_config="$BASE_DIR/config/lsp/$name.json"
    if [[ -f "$lsp_config" ]]; then
        cp "$lsp_config" "$output_dir/.lsp.json"
        # Add lspServers reference to plugin.json
        local plugin_json="$output_dir/.claude-plugin/plugin.json"
        jq '. + {"lspServers": "../.lsp.json"}' "$plugin_json" > "${plugin_json}.tmp" && mv "${plugin_json}.tmp" "$plugin_json"
        log_success "  lsp: $(jq -r '.lspServers | keys[0]' "$lsp_config")"
    fi

    # Standalone resources (outside plugin spec)
    copy_standalone "$manifest" "$output_dir" "rules" "$BASE_DIR/resources/rules" || ((total_missing += $?))
    copy_standalone "$manifest" "$output_dir" "workflows" "$BASE_DIR/resources/workflows" || ((total_missing += $?))
    copy_standalone "$manifest" "$output_dir" "templates" "$BASE_DIR/resources/templates" || ((total_missing += $?))

    echo ""
    log_success "Built: $name v$version -> $output_dir"
    if [[ $total_missing -gt 0 ]]; then
        log_warn "$total_missing resources missing"
    fi

    # Clear Claude Code plugin cache to prevent stale versions
    local cache_dir="${CLAUDE_CACHE_DIR:-${CLAUDE_HOME:-$HOME/.claude}/plugins/cache/lamella}"
    if [[ -d "$cache_dir" ]]; then
        rm -rf "$cache_dir" 2>/dev/null && \
            log_success "  Cleared plugin cache ($cache_dir)" || \
            log_warn "  Could not clear plugin cache at $cache_dir"
        log_info "  Restart Claude Code to pick up rebuilt plugins."
    fi

    return 0
}

main() {
    check_deps
    [[ $# -lt 1 ]] && usage

    local manifest="$1"
    local output_dir="${2:-}"

    if [[ ! "$manifest" = /* ]]; then
        if [[ -f "$manifest" ]]; then
            manifest="$(cd "$(dirname "$manifest")" && pwd)/$(basename "$manifest")"
        else
            manifest="$BASE_DIR/$manifest"
        fi
    fi

    build_plugin "$manifest" "$output_dir"
}

main "$@"
