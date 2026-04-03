#!/usr/bin/env bash
#
# build-codex-skills.sh - Build lamella resources into Codex skill and agent exports
#
# Codex consumes installed skill directories and custom agent TOML files, not
# Claude plugin manifests.
# This builder exports portable resources into dist/codex/ so they can be
# installed or symlinked into ~/.codex/skills and ~/.codex/agents.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"

# shellcheck source=../scripts/lib/content-root.sh
source "$BASE_DIR/scripts/lib/content-root.sh"

DEFAULT_MANIFEST_DIR="$BASE_DIR/manifests/codex"
DEFAULT_OUTPUT_DIR="$BASE_DIR/dist/codex"
COPY_SHARED_SUBAGENTS_SCRIPT="$BASE_DIR/scripts/build/copy-shared-subagents.js"

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

usage() {
    cat <<EOF
Usage: $0 [manifest-or-dir] [output-dir]

Build lamella's portable resources into Codex skill and agent exports.

Arguments:
  manifest-or-dir  Optional manifest file or directory
                   Default: manifests/codex
  output-dir       Optional output directory
                   Default: dist/codex
EOF
    exit 1
}

check_deps() {
    if ! command -v jq >/dev/null 2>&1; then
        log_error "jq is required. Install it with your package manager (for example: brew install jq or apt-get install jq)."
        exit 1
    fi
    if ! command -v node >/dev/null 2>&1; then
        log_error "node is required. Install Node.js 18+."
        exit 1
    fi
}

manifest_name() {
    jq -r '.name // empty' "$1"
}

manifest_description() {
    jq -r '.description // ""' "$1"
}

manifest_dependencies() {
    jq -r '.dependencies // [] | .[]' "$1"
}

json_array() {
    jq -r "$2 // [] | .[]" "$1"
}

slugify() {
    echo "$1" \
        | tr '[:upper:]' '[:lower:]' \
        | sed -E 's/\.[^.]+$//; s#[^a-z0-9]+#-#g; s#^-+##; s#-+$##'
}

copy_dir_contents() {
    local src="$1"
    local dst="$2"

    mkdir -p "$dst"
    cp -R "$src"/. "$dst"/
}

write_file() {
    local path="$1"
    local body="$2"

    mkdir -p "$(dirname "$path")"
    printf '%s\n' "$body" > "$path"
}

create_workflow_wrapper() {
    local source_rel="$1"
    local profile_skills_dir="$2"
    local all_skills_dir="$3"
    local src="$CONTENT_ROOT/workflows/$source_rel"
    local skill_name="workflow-$(slugify "$source_rel")"
    local file_name
    file_name=$(basename "$source_rel")
    local title
    title=$(basename "$source_rel" .md)

    if [[ ! -f "$src" ]]; then
        log_warn "Missing workflow: $source_rel"
        return 1
    fi

    local skill_body="---
name: $skill_name
description: Use when you want to follow the lamella $title workflow from Codex.
---

# $title

Use this skill when the current task matches the bundled workflow in \`references/$file_name\`.

1. Read \`references/$file_name\`.
2. Apply the workflow to the current task.
3. Adapt the workflow to the current repo and tool constraints.
"

    mkdir -p "$profile_skills_dir/$skill_name/references"
    cp "$src" "$profile_skills_dir/$skill_name/references/$file_name"
    write_file "$profile_skills_dir/$skill_name/SKILL.md" "$skill_body"

    if [[ ! -e "$all_skills_dir/$skill_name" ]]; then
        mkdir -p "$all_skills_dir/$skill_name/references"
        cp "$src" "$all_skills_dir/$skill_name/references/$file_name"
        write_file "$all_skills_dir/$skill_name/SKILL.md" "$skill_body"
    fi
}

create_template_wrapper() {
    local source_rel="$1"
    local profile_skills_dir="$2"
    local all_skills_dir="$3"
    local src="$CONTENT_ROOT/templates/$source_rel"
    local skill_name="template-$(slugify "$source_rel")"
    local file_name
    file_name=$(basename "$source_rel")
    local title
    title=$(basename "$source_rel")

    if [[ ! -f "$src" ]]; then
        log_warn "Missing template: $source_rel"
        return 1
    fi

    local skill_body="---
name: $skill_name
description: Use when you want to apply the lamella $title template from Codex.
---

# $title

Use this skill when you need the bundled template in \`assets/$file_name\`.

1. Open \`assets/$file_name\`.
2. Reuse or adapt the template to the current task.
3. Keep the output aligned with the template structure unless project constraints require otherwise.
"

    mkdir -p "$profile_skills_dir/$skill_name/assets"
    cp "$src" "$profile_skills_dir/$skill_name/assets/$file_name"
    write_file "$profile_skills_dir/$skill_name/SKILL.md" "$skill_body"

    if [[ ! -e "$all_skills_dir/$skill_name" ]]; then
        mkdir -p "$all_skills_dir/$skill_name/assets"
        cp "$src" "$all_skills_dir/$skill_name/assets/$file_name"
        write_file "$all_skills_dir/$skill_name/SKILL.md" "$skill_body"
    fi
}

create_script_wrapper() {
    local source_rel="$1"
    local profile_skills_dir="$2"
    local all_skills_dir="$3"
    local src="$BASE_DIR/scripts/$source_rel"
    local skill_name="script-$(slugify "$source_rel")"
    local file_name
    file_name=$(basename "$source_rel")

    if [[ ! -f "$src" ]]; then
        log_warn "Missing script: $source_rel"
        return 1
    fi

    local skill_body="---
name: $skill_name
description: Use when you want to run or adapt the bundled lamella script \`$file_name\`.
---

# $file_name

Use this skill when the bundled helper script is relevant to the task.

1. Inspect \`scripts/$file_name\`.
2. Run or adapt it as needed for the current repo.
3. Prefer patching the script over rewriting its logic from scratch.
"

    mkdir -p "$profile_skills_dir/$skill_name/scripts"
    cp "$src" "$profile_skills_dir/$skill_name/scripts/$file_name"
    write_file "$profile_skills_dir/$skill_name/SKILL.md" "$skill_body"

    if [[ ! -e "$all_skills_dir/$skill_name" ]]; then
        mkdir -p "$all_skills_dir/$skill_name/scripts"
        cp "$src" "$all_skills_dir/$skill_name/scripts/$file_name"
        write_file "$all_skills_dir/$skill_name/SKILL.md" "$skill_body"
    fi
}

copy_skill() {
    local source_rel="$1"
    local profile_skills_dir="$2"
    local all_skills_dir="$3"
    local src="$CONTENT_ROOT/skills/$source_rel"
    local skill_name
    skill_name=$(basename "$source_rel")

    if [[ ! -d "$src" ]]; then
        log_warn "Missing skill: $source_rel"
        return 1
    fi

    rm -rf "$profile_skills_dir/$skill_name"
    copy_dir_contents "$src" "$profile_skills_dir/$skill_name"

    if [[ ! -e "$all_skills_dir/$skill_name" ]]; then
        copy_dir_contents "$src" "$all_skills_dir/$skill_name"
    fi
}

collect_manifest_closure() {
    local manifest="$1"
    local manifests_dir="$2"
    local dep dep_path

    for dep in $(manifest_dependencies "$manifest"); do
        dep_path="$manifests_dir/$dep.yaml"
        if [[ ! -f "$dep_path" ]]; then
            log_warn "Missing dependent Codex manifest: $dep (required by $(basename "$manifest"))"
            continue
        fi
        collect_manifest_closure "$dep_path" "$manifests_dir"
    done

    local existing
    for existing in "${RESOLVED_MANIFESTS[@]:-}"; do
        [[ "$existing" == "$manifest" ]] && return 0
    done

    RESOLVED_MANIFESTS+=("$manifest")
}

resolved_resource_items() {
    local resource_type="$1"
    shift

    local seen=""
    local manifest item
    for manifest in "$@"; do
        while IFS= read -r item; do
            [[ -z "$item" ]] && continue
            if ! printf '%s' "$seen" | grep -Fqx "$item"; then
                seen="${seen}${item}"$'\n'
                printf '%s\n' "$item"
            fi
        done < <(json_array "$manifest" ".resources.\"$resource_type\"")
    done
}

build_manifest() {
    local manifest="$1"
    local output_dir="$2"
    local all_skills_dir="$output_dir/skills"
    local profiles_dir="$output_dir/profiles"
    local manifests_dir
    local name description profile_dir profile_skills_dir
    local skill_count=0 workflow_count=0 template_count=0 script_count=0 subagent_count=0
    local dependency_names=""
    local resolved_name=""

    name=$(manifest_name "$manifest")
    description=$(manifest_description "$manifest")

    if [[ -z "$name" ]]; then
        log_warn "Skipping unnamed manifest: $manifest"
        return 0
    fi

    profile_dir="$profiles_dir/$name"
    profile_skills_dir="$profile_dir/skills"
    manifests_dir="$(dirname "$manifest")"

    rm -rf "$profile_dir"
    mkdir -p "$profile_skills_dir" "$all_skills_dir"

    log_info "Building Codex profile: $name"

    RESOLVED_MANIFESTS=()
    collect_manifest_closure "$manifest" "$manifests_dir"

    local resolved_manifest
    for resolved_manifest in "${RESOLVED_MANIFESTS[@]}"; do
        resolved_name="$(manifest_name "$resolved_manifest")"
        if [[ "$resolved_name" != "$name" ]]; then
            if [[ -z "$dependency_names" ]]; then
                dependency_names="\"$resolved_name\""
            else
                dependency_names="$dependency_names,\"$resolved_name\""
            fi
        fi
    done

    while IFS= read -r item; do
        [[ -z "$item" ]] && continue
        copy_skill "$item" "$profile_skills_dir" "$all_skills_dir"
        skill_count=$((skill_count + 1))
    done < <(resolved_resource_items skills "${RESOLVED_MANIFESTS[@]}")

    while IFS= read -r item; do
        [[ -z "$item" ]] && continue
        create_workflow_wrapper "$item" "$profile_skills_dir" "$all_skills_dir"
        workflow_count=$((workflow_count + 1))
    done < <(resolved_resource_items workflows "${RESOLVED_MANIFESTS[@]}")

    while IFS= read -r item; do
        [[ -z "$item" ]] && continue
        create_template_wrapper "$item" "$profile_skills_dir" "$all_skills_dir"
        template_count=$((template_count + 1))
    done < <(resolved_resource_items templates "${RESOLVED_MANIFESTS[@]}")

    while IFS= read -r item; do
        [[ -z "$item" ]] && continue
        create_script_wrapper "$item" "$profile_skills_dir" "$all_skills_dir"
        script_count=$((script_count + 1))
    done < <(resolved_resource_items scripts "${RESOLVED_MANIFESTS[@]}")

    subagent_count=$(node "$COPY_SHARED_SUBAGENTS_SCRIPT" codex "$name" "$profile_dir" | awk '/^Emitted / {print $2}')
    [[ -n "$subagent_count" && "$subagent_count" != "0" ]] && log_success "  shared-subagents: $subagent_count files"

    jq -n \
        --arg name "$name" \
        --arg description "$description" \
        --arg manifest "$(basename "$manifest")" \
        --arg output "./profiles/$name" \
        --argjson dependencies "[${dependency_names}]" \
        --argjson skills "$skill_count" \
        --argjson workflows "$workflow_count" \
        --argjson templates "$template_count" \
        --argjson scripts "$script_count" \
        --argjson subagents "${subagent_count:-0}" \
        '{
            name: $name,
            description: $description,
            manifest: $manifest,
            output: $output,
            dependencies: $dependencies,
            resources: {
                skills: $skills,
                workflow_wrappers: $workflows,
                template_wrappers: $templates,
                script_wrappers: $scripts,
                subagents: $subagents
            }
        }' > "$profile_dir/profile.json"
}

write_index() {
    local output_dir="$1"

    find "$output_dir/profiles" -name profile.json -print 2>/dev/null \
        | sort \
        | while IFS= read -r profile; do
            cat "$profile"
        done \
        | jq -s --arg output "./skills" '{
            generated_at: (now | todate),
            skills_output: $output,
            profiles: .
        }' > "$output_dir/index.json"
}

main() {
    check_deps

    local manifest_input="${1:-$DEFAULT_MANIFEST_DIR}"
    local output_dir="${2:-$DEFAULT_OUTPUT_DIR}"
    local manifests=()

    if [[ "$manifest_input" == "-h" || "$manifest_input" == "--help" ]]; then
        usage
    fi

    if [[ ! "$manifest_input" = /* ]]; then
        if [[ -e "$manifest_input" ]]; then
            manifest_input="$(cd "$(dirname "$manifest_input")" && pwd)/$(basename "$manifest_input")"
        else
            manifest_input="$BASE_DIR/$manifest_input"
        fi
    fi

    mkdir -p "$output_dir"
    rm -rf "$output_dir/profiles" "$output_dir/skills"
    mkdir -p "$output_dir/profiles" "$output_dir/skills"

    if [[ -d "$manifest_input" ]]; then
        local manifest
        for manifest in "$manifest_input"/*; do
            [[ -f "$manifest" ]] || continue
            case "$manifest" in
                *.yaml|*.yml|*.json)
                    manifests+=("$manifest")
                    ;;
            esac
        done
    elif [[ -f "$manifest_input" ]]; then
        manifests+=("$manifest_input")
    else
        log_error "Manifest input not found: $manifest_input"
        usage
    fi

    if [[ ${#manifests[@]} -eq 0 ]]; then
        log_error "No manifests found in $manifest_input"
        exit 1
    fi

    echo -e "${BOLD}Building Codex Exports${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    local built=0
    local manifest
    for manifest in "${manifests[@]}"; do
        build_manifest "$manifest" "$output_dir"
        built=$((built + 1))
    done

    write_index "$output_dir"

    local total_skills total_agents
    total_skills=$(find "$output_dir/skills" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
    total_agents=$(find "$output_dir/profiles" -path '*/agents/*.toml' -type f | wc -l | tr -d ' ')

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BOLD}Codex Build Complete${NC}"
    echo -e "  Profiles built: ${GREEN}$built${NC}"
    echo -e "  Skills exported: ${GREEN}$total_skills${NC}"
    echo -e "  Agents exported: ${GREEN}$total_agents${NC}"
    echo -e "  Output:          $output_dir"
    echo ""
    echo "Install with:"
    echo "  ./lamella install-codex --all"
    echo ""
    echo "Manual export paths:"
    echo "  Skills: $output_dir/skills"
    echo "  Agents: $output_dir/profiles/<profile>/agents"
}

main "$@"
