#!/usr/bin/env bash
#
# install-codex-skills.sh - Install built lamella Codex skills
#
# Installs exported skill directories from dist/codex/skills/ into
# $CODEX_HOME/skills (default: ~/.codex/skills).
#
# Usage:
#   ./builders/install-codex-skills.sh --list
#   ./builders/install-codex-skills.sh --all
#   ./builders/install-codex-skills.sh code-review-pro systematic-debugging
#   ./builders/install-codex-skills.sh --dry-run --all
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
DIST_DIR="$BASE_DIR/dist/codex/skills"
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
CODEX_SKILLS_DIR="$CODEX_HOME/skills"

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

DRY_RUN=false
FORCE=false
UNINSTALL=false
LIST_ONLY=false
INSTALL_ALL=false
SKILLS=()

usage() {
    cat <<EOF
${BOLD}install-codex-skills.sh${NC} - Install built lamella Codex skills

${BOLD}USAGE${NC}
    $0 [options] [skill-names...]

${BOLD}OPTIONS${NC}
    -l, --list        List available built skills
    -a, --all         Install all built skills
    -u, --uninstall   Uninstall specified skills
    -n, --dry-run     Show what would be done
    -f, --force       Overwrite existing installed skills
    -h, --help        Show this help

${BOLD}EXAMPLES${NC}
    $0 --list
    $0 --all
    $0 code-review-pro systematic-debugging
    $0 --uninstall workflow-development-tdd

${BOLD}NOTES${NC}
    Build the Codex export first:
      make build-codex

    Install destination:
      $CODEX_SKILLS_DIR
EOF
    exit 0
}

get_available_skills() {
    [[ ! -d "$DIST_DIR" ]] && return 0
    for d in "$DIST_DIR"/*/; do
        [[ -d "$d" ]] && basename "$d"
    done | sort
}

list_skills() {
    echo -e "${BOLD}Available Codex Skills${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    if [[ ! -d "$DIST_DIR" ]]; then
        log_warn "No built Codex skills found. Run 'make build-codex' first."
        exit 1
    fi

    local skills
    skills=$(get_available_skills)
    [[ -z "$skills" ]] && { log_warn "No skills found."; exit 1; }

    printf "${BOLD}%-42s %-12s %-40s${NC}\n" "SKILL" "STATUS" "DESCRIPTION"
    echo "────────────────────────────────────────────────────────────────────────────────────────"

    while IFS= read -r skill; do
        [[ -z "$skill" ]] && continue
        local skill_md="$DIST_DIR/$skill/SKILL.md"
        local description=""
        if [[ -f "$skill_md" ]]; then
            description=$(sed -n '1,20p' "$skill_md" | awk -F': ' '/^description:/ {print $2; exit}' | head -c 40)
        fi

        local status="built"
        [[ -d "$CODEX_SKILLS_DIR/$skill" ]] && status="installed"

        printf "%-42s %-12s %-40s\n" "$skill" "$status" "${description:0:40}"
    done <<< "$skills"
}

install_skill() {
    local skill="$1"
    local src="$DIST_DIR/$skill"
    local dst="$CODEX_SKILLS_DIR/$skill"

    if [[ ! -d "$src" ]]; then
        log_error "Built skill not found: $skill"
        return 1
    fi

    if $DRY_RUN; then
        echo "  [dry-run] Would install: $skill -> $dst"
        return 0
    fi

    mkdir -p "$CODEX_SKILLS_DIR"

    if [[ -d "$dst" ]]; then
        if ! $FORCE; then
            log_warn "Already installed: $skill (use --force to overwrite)"
            return 0
        fi
        rm -rf "$dst"
    fi

    cp -R "$src" "$dst"
    log_success "Installed: $skill"
}

uninstall_skill() {
    local skill="$1"
    local dst="$CODEX_SKILLS_DIR/$skill"

    if [[ ! -d "$dst" ]]; then
        log_warn "Not installed: $skill"
        return 0
    fi

    if $DRY_RUN; then
        echo "  [dry-run] Would remove: $dst"
        return 0
    fi

    rm -rf "$dst"
    log_success "Removed: $skill"
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -l|--list) LIST_ONLY=true; shift ;;
            -a|--all) INSTALL_ALL=true; shift ;;
            -u|--uninstall) UNINSTALL=true; shift ;;
            -n|--dry-run) DRY_RUN=true; shift ;;
            -f|--force) FORCE=true; shift ;;
            -h|--help) usage ;;
            -*) log_error "Unknown option: $1"; usage ;;
            *) SKILLS+=("$1"); shift ;;
        esac
    done
}

main() {
    parse_args "$@"

    if $LIST_ONLY; then
        list_skills
        exit 0
    fi

    if [[ ! -d "$DIST_DIR" ]]; then
        log_error "Built Codex skills not found at $DIST_DIR"
        log_info "Run 'make build-codex' first."
        exit 1
    fi

    if $INSTALL_ALL; then
        while IFS= read -r skill; do
            [[ -z "$skill" ]] && continue
            SKILLS+=("$skill")
        done < <(get_available_skills)
    fi

    if [[ ${#SKILLS[@]} -eq 0 ]]; then
        usage
    fi

    local failed=0
    local skill
    for skill in "${SKILLS[@]}"; do
        if $UNINSTALL; then
            uninstall_skill "$skill" || failed=$((failed + 1))
        else
            install_skill "$skill" || failed=$((failed + 1))
        fi
    done

    if ! $UNINSTALL; then
        echo ""
        log_info "Restart Codex to pick up new skills."
    fi

    [[ $failed -eq 0 ]]
}

main "$@"
