#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Where to write new skills — respects LAMELLA_CONTENT_ROOT for testing.
CONTENT_ROOT="${LAMELLA_CONTENT_ROOT:-$BASE_DIR/resources}"

# Where to find scaffold templates — always the real content root, not the test
# override. Tests point LAMELLA_CONTENT_ROOT at an empty temp dir, so template
# resolution stays independent of it and probes known content layouts instead.
if [[ -d "$BASE_DIR/../lamella-skills/templates" ]]; then
    # Local dev: lamella-skills is a sibling repo.
    _TEMPLATE_ROOT="$(cd "$BASE_DIR/.." && pwd)/lamella-skills"
elif [[ -d "$BASE_DIR/lamella-skills/templates" ]]; then
    # CI: lamella-skills is checked out as a workspace subdir.
    _TEMPLATE_ROOT="$BASE_DIR/lamella-skills"
else
    # Legacy in-repo content.
    _TEMPLATE_ROOT="$BASE_DIR/resources"
fi
TEMPLATE="$_TEMPLATE_ROOT/templates/skills/SKILL.md.template"

usage() {
    cat <<'EOF'
Usage:
  ./lamella scaffold skill <category>/<name> --description "What the skill does and when to use it."

Options:
  --description <text>  Required skill description
  --dry-run             Print the target path without writing files
  --force               Overwrite an existing SKILL.md
EOF
}

title_case() {
    local input="$1"
    python3 - "$input" <<'PY'
import sys
parts = sys.argv[1].replace('-', ' ').split()
print(' '.join(word[:1].upper() + word[1:] for word in parts))
PY
}

require_segment() {
    local value="$1"
    if [[ ! "$value" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
        echo "lamella scaffold skill: invalid segment '$value' (expected kebab-case)" >&2
        exit 1
    fi
}

main() {
    local spec=""
    local description=""
    local dry_run=false
    local force=false

    while [[ $# -gt 0 ]]; do
        case "$1" in
            --description)
                shift
                description="${1:-}"
                ;;
            --dry-run)
                dry_run=true
                ;;
            --force)
                force=true
                ;;
            -h|--help|help)
                usage
                exit 0
                ;;
            *)
                if [[ -z "$spec" ]]; then
                    spec="$1"
                else
                    echo "lamella scaffold skill: unexpected argument '$1'" >&2
                    exit 1
                fi
                ;;
        esac
        shift || true
    done

    if [[ -z "$spec" || -z "$description" ]]; then
        usage
        exit 1
    fi

    if [[ "$spec" != */* ]]; then
        echo "lamella scaffold skill: expected <category>/<name>" >&2
        exit 1
    fi

    local category="${spec%%/*}"
    local skill_name="${spec##*/}"
    require_segment "$category"
    require_segment "$skill_name"

    local skill_dir="$CONTENT_ROOT/skills/$category/$skill_name"
    local skill_md="$skill_dir/SKILL.md"
    local title
    title="$(title_case "$skill_name")"
    local description_lower
    description_lower="$(printf '%s' "$description" | tr '[:upper:]' '[:lower:]')"

    if [[ "$dry_run" == true ]]; then
        printf '%s\n' "$skill_md"
        exit 0
    fi

    if [[ -e "$skill_md" && "$force" != true ]]; then
        echo "lamella scaffold skill: $skill_md already exists (use --force to overwrite)" >&2
        exit 1
    fi

    mkdir -p "$skill_dir"

    sed \
        -e "s|__SKILL_NAME__|$skill_name|g" \
        -e "s|__DESCRIPTION__|$description|g" \
        -e "s|__DESCRIPTION_LOWER__|$description_lower|g" \
        -e "s|__TITLE__|$title|g" \
        "$TEMPLATE" > "$skill_md"

    printf 'Created %s\n' "$skill_md"
}

main "$@"
