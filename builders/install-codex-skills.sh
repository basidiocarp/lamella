#!/usr/bin/env bash
#
# install-codex-skills.sh - Install built lamella Codex skills and agents
#
# Installs exported skill directories from dist/codex/skills/ into
# $CODEX_HOME/skills (default: ~/.codex/skills) and generated shared agents
# from dist/codex/profiles/*/agents/ into $CODEX_HOME/agents.
#
# Usage:
#   ./builders/install-codex-skills.sh --list
#   ./builders/install-codex-skills.sh --all
#   ./builders/install-codex-skills.sh code-review-pro systematic-debugging
#   ./builders/install-codex-skills.sh --with-agents code-review-pro
#   ./builders/install-codex-skills.sh --agents-only --all
#   ./builders/install-codex-skills.sh --dry-run --all
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
DIST_DIR="$BASE_DIR/dist/codex/skills"
PROFILES_DIR="$BASE_DIR/dist/codex/profiles"
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
CODEX_SKILLS_DIR="$CODEX_HOME/skills"
CODEX_AGENTS_DIR="$CODEX_HOME/agents"

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
INSTALL_AGENTS=false
AGENTS_ONLY=false
SKILLS_ONLY=false
SKILLS=()

usage() {
    cat <<EOF
${BOLD}install-codex-skills.sh${NC} - Install built lamella Codex skills and agents

${BOLD}USAGE${NC}
    $0 [options] [names...]

${BOLD}OPTIONS${NC}
    -l, --list         List available built skills and agents
    -a, --all          Install all built skills and all built agents
    --with-agents      Install all built agents alongside the selected skills
    --agents-only      Install or uninstall agents only
    --skills-only      Install or uninstall skills only
    -u, --uninstall    Uninstall specified items
    -n, --dry-run      Show what would be done
    -f, --force        Overwrite existing installed items
    -h, --help         Show this help

${BOLD}EXAMPLES${NC}
    $0 --list
    $0 --all
    $0 code-review-pro systematic-debugging
    $0 --with-agents code-review-pro
    $0 --agents-only --all
    $0 --uninstall workflow-development-tdd

${BOLD}NOTES${NC}
    Build the Codex export first:
      make build-codex

    Install destination:
      $CODEX_SKILLS_DIR
      $CODEX_AGENTS_DIR
EOF
    exit 0
}

get_available_skills() {
    [[ ! -d "$DIST_DIR" ]] && return 0
    for d in "$DIST_DIR"/*/; do
        [[ -d "$d" ]] && basename "$d"
    done | sort
}

get_available_agents() {
    [[ ! -d "$PROFILES_DIR" ]] && return 0
    find "$PROFILES_DIR" -path '*/agents/*.toml' -type f -print 2>/dev/null \
        | while IFS= read -r file; do
            basename "$file" .toml
        done | sort -u
}

resolve_agent_source() {
    local agent="$1"
    local matches=()
    local file

    while IFS= read -r file; do
        [[ -z "$file" ]] && continue
        matches+=("$file")
    done < <(find "$PROFILES_DIR" -path "*/agents/$agent.toml" -type f -print 2>/dev/null | sort)

    if [[ ${#matches[@]} -eq 0 ]]; then
        return 1
    fi

    local canonical="${matches[0]}"
    local candidate
    for candidate in "${matches[@]:1}"; do
        if ! cmp -s "$canonical" "$candidate"; then
            log_error "Agent name collision for '$agent':"
            log_error "  $canonical"
            log_error "  $candidate"
            log_error "Refusing to install conflicting agent definitions."
            return 2
        fi
    done

    printf '%s\n' "$canonical"
}

list_items() {
    local found=false

    echo -e "${BOLD}Available Codex Skills${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    local skills
    skills=$(get_available_skills)
    if [[ -n "$skills" ]]; then
        found=true
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
    else
        echo "No built skills found."
    fi

    echo ""
    echo -e "${BOLD}Available Codex Agents${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    local agents
    agents=$(get_available_agents)
    if [[ -n "$agents" ]]; then
        found=true
        printf "${BOLD}%-42s %-12s %-24s${NC}\n" "AGENT" "STATUS" "PROFILE"
        echo "────────────────────────────────────────────────────────────────────────────────────────"

        while IFS= read -r agent; do
            [[ -z "$agent" ]] && continue
            local src=""
            if ! src=$(resolve_agent_source "$agent"); then
                continue
            fi
            local profile
            profile=$(basename "$(dirname "$(dirname "$src")")")
            local status="built"
            [[ -f "$CODEX_AGENTS_DIR/$agent.toml" ]] && status="installed"
            printf "%-42s %-12s %-24s\n" "$agent" "$status" "$profile"
        done <<< "$agents"
    else
        echo "No built agents found."
    fi

    if [[ "$found" == false ]]; then
        log_warn "No built Codex exports found. Run 'make build-codex' first."
        exit 1
    fi
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

install_agent() {
    local agent="$1"
    local src=""
    local dst="$CODEX_AGENTS_DIR/$agent.toml"

    if ! src=$(resolve_agent_source "$agent"); then
        local code=$?
        if [[ $code -eq 1 ]]; then
            log_error "Built agent not found: $agent"
        fi
        return 1
    fi

    if $DRY_RUN; then
        echo "  [dry-run] Would install agent: $agent -> $dst"
        return 0
    fi

    mkdir -p "$CODEX_AGENTS_DIR"

    if [[ -f "$dst" ]]; then
        if ! $FORCE; then
            log_warn "Already installed: $agent (use --force to overwrite)"
            return 0
        fi
        rm -f "$dst"
    fi

    cp "$src" "$dst"
    log_success "Installed agent: $agent"
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

uninstall_agent() {
    local agent="$1"
    local dst="$CODEX_AGENTS_DIR/$agent.toml"

    if [[ ! -f "$dst" ]]; then
        log_warn "Not installed: $agent"
        return 0
    fi

    if $DRY_RUN; then
        echo "  [dry-run] Would remove agent: $dst"
        return 0
    fi

    rm -f "$dst"
    log_success "Removed agent: $agent"
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -l|--list) LIST_ONLY=true; shift ;;
            -a|--all) INSTALL_ALL=true; shift ;;
            --with-agents) INSTALL_AGENTS=true; shift ;;
            --agents-only) AGENTS_ONLY=true; shift ;;
            --skills-only) SKILLS_ONLY=true; INSTALL_AGENTS=false; shift ;;
            -u|--uninstall) UNINSTALL=true; shift ;;
            -n|--dry-run) DRY_RUN=true; shift ;;
            -f|--force) FORCE=true; shift ;;
            -h|--help) usage ;;
            -*) log_error "Unknown option: $1"; usage ;;
            *) SKILLS+=("$1"); shift ;;
        esac
    done

    if $AGENTS_ONLY && $INSTALL_AGENTS; then
        log_error "Use either --agents-only or --with-agents, not both"
        exit 1
    fi

    if $AGENTS_ONLY && $SKILLS_ONLY; then
        log_error "Use either --agents-only or --skills-only, not both"
        exit 1
    fi

    if $SKILLS_ONLY && $INSTALL_AGENTS; then
        log_error "Use either --skills-only or --with-agents, not both"
        exit 1
    fi
}

main() {
    parse_args "$@"
    local restart_target="skills and agents"

    if $LIST_ONLY; then
        list_items
        exit 0
    fi

    if [[ ! -d "$DIST_DIR" && ! -d "$PROFILES_DIR" ]]; then
        log_error "Built Codex exports not found at $DIST_DIR or $PROFILES_DIR"
        log_info "Run 'make build-codex' first."
        exit 1
    fi

    if $INSTALL_ALL; then
        if ! $AGENTS_ONLY; then
            while IFS= read -r skill; do
                [[ -z "$skill" ]] && continue
                SKILLS+=("$skill")
            done < <(get_available_skills)
        fi
        if ! $SKILLS_ONLY; then
            INSTALL_AGENTS=true
        fi
    fi

    if $AGENTS_ONLY; then
        restart_target="agents"
    elif ! $INSTALL_AGENTS; then
        restart_target="skills"
    fi

    if [[ ${#SKILLS[@]} -eq 0 && $AGENTS_ONLY == false && $INSTALL_AGENTS == false ]]; then
        usage
    fi

    local failed=0
    local skill
    if ! $AGENTS_ONLY; then
        for skill in "${SKILLS[@]}"; do
            if $UNINSTALL; then
                uninstall_skill "$skill" || failed=$((failed + 1))
            else
                install_skill "$skill" || failed=$((failed + 1))
            fi
        done
    fi

    if $INSTALL_AGENTS || $AGENTS_ONLY; then
        local agents
        if $AGENTS_ONLY && [[ ${#SKILLS[@]} -gt 0 ]]; then
            agents=$(printf '%s\n' "${SKILLS[@]}")
        else
            agents=$(get_available_agents)
        fi

        local agent
        while IFS= read -r agent; do
            [[ -z "$agent" ]] && continue
            if $UNINSTALL; then
                uninstall_agent "$agent" || failed=$((failed + 1))
            else
                install_agent "$agent" || failed=$((failed + 1))
            fi
        done <<< "$agents"
    fi

    if ! $UNINSTALL; then
        echo ""
        log_info "Restart Codex to pick up new $restart_target."
    fi

    [[ $failed -eq 0 ]]
}

main "$@"
