# lamella

A portable resource system for AI coding environments, with first-class Claude
plugin builds and Codex skill exports.

Claude builds follow the **official Claude Code plugin format**
(`.claude-plugin/plugin.json`). Codex builds export installable skill folders.

## Quick Start

```bash
# Claude: build marketplace + install plugins
make build-marketplace
./install.sh core python typescript

# Codex: generate manifests + build skill exports
make build-codex

# Codex: build and install exported skills
./install-codex.sh --all
```

## As a Claude Code Marketplace

After building, `dist/claude/` is a proper Claude Code marketplace:

```bash
# Build the marketplace
make build-marketplace

# Add it in Claude Code
/plugin marketplace add ./dist/claude

# Or load a single plugin for testing
claude --plugin-dir dist/claude/plugins/core
```

## As a Codex Skill Export

After building, `dist/codex/skills/` contains portable skill folders that can be
copied or symlinked into `~/.codex/skills/`.

```bash
make build-codex
./install-codex.sh --list
./install-codex.sh --all
```

## Plugins

| Plugin | Skills | Agents | Cmds | Description |
|--------|--------|--------|------|-------------|
| **tools** | 26 | 3 | 6 | CLI tools, shell scripting, MCP integration, API design |
| **security** | 24 | 13 | 5 | Vulnerability scanning, threat modeling, fuzzing |
| **core** | 24 | 9 | 5 | Coding standards, testing, git workflow, debugging |
| **devops** | 24 | 9 | 2 | Docker, Kubernetes, Terraform, AWS, CI/CD |
| **atmos** | 20 | — | — | Cloud Posse Atmos stack orchestration |
| **meta** | 17 | — | — | Framework internals, skill management |
| **workflow** | 14 | — | — | Planning, git operations, decision records |
| **agile-pm** | 12 | — | — | Agile, product management, discovery |
| **python** | 10 | 3 | 2 | Django, FastAPI, async patterns |
| **ai-agents** | 9 | 5 | 4 | Multi-agent patterns, LLM evaluation |
| **frontend** | 9 | — | — | UI/UX design, component patterns |
| **typescript** | 9 | 3 | 1 | React, Next.js, Node.js patterns |
| **writing** | 7 | 12 | 4 | Documentation, articles, changelogs |
| **collaboration** | 6 | — | — | Meetings, decision-making, coordination |
| **microservices** | 4 | — | — | Event sourcing, distributed systems |
| **rag** | 4 | — | — | Vector search, embeddings, RAG architecture |
| **rust** | 4 | 1 | 1 | Async patterns, testing, idiomatic Rust |
| **cpp** | 3 | — | — | Modern C++ patterns, coding standards |
| **database** | 2 | 4 | 3 | SQL optimization, PostgreSQL, migrations |
| **go** | 2 | 1 | 1 | Concurrency patterns, testing, idiomatic Go |

**Total: 230 skills, 175 agents, 213 commands across 20 plugins**

## Directory Structure

```
lamella/
├── resources/
│   ├── skills/           # Source skills (organized by category)
│   ├── agents/           # Agent definitions (source, by category)
│   ├── commands/         # Slash commands (source, by category)
│   ├── hooks/            # Event hooks
│   ├── rules/            # Project rules
│   ├── templates/        # Configuration and doc templates
│   ├── workflows/        # Development and quality workflows
│   ├── mcp-configs/      # MCP server configs
│   └── scripts/          # Build and validation scripts
├── manifests/
│   ├── claude/           # Claude plugin manifests
│   └── codex/            # Codex export manifests
├── builders/
│   ├── build-claude-plugin.sh
│   ├── build-claude-marketplace.sh
│   ├── sync-codex-manifests.sh
│   └── build-codex-skills.sh
├── scripts/
│   ├── plugins/          # Build + install pipeline
│   │   ├── build-plugin.sh       # Build single plugin
│   │   ├── build-marketplace.sh  # Build all + marketplace.json
│   │   └── install-plugin.sh     # Install to ~/.claude/plugins/
│   ├── ci/               # Validators (8 scripts)
│   └── hooks/            # Hook scripts
├── dist/                 # Built output (gitignored)
│   ├── claude/
│   │   ├── .claude-plugin/marketplace.json
│   │   └── plugins/<name>/
│   └── codex/
│       ├── skills/<skill-name>/
│       └── profiles/<name>/
└── docs/                 # Documentation
```

## Build Pipeline

The source organizes resources in category subdirectories (`resources/agents/code-quality/code-reviewer.md`).
The generalized build step can either flatten them into Claude Code plugin
directories or export portable Codex skill folders.

```
Source:  resources/agents/code-quality/code-reviewer.md
         resources/skills/core/brainstorming/SKILL.md

Built:   dist/claude/plugins/core/agents/code-reviewer.md
         dist/claude/plugins/core/skills/brainstorming/SKILL.md
         dist/claude/plugins/core/.claude-plugin/plugin.json

Codex:   dist/codex/skills/brainstorming/SKILL.md
         dist/codex/profiles/core/profile.json
```

### Claude build

Build one plugin from its manifest:

```bash
bash builders/build-claude-plugin.sh manifests/claude/core.json
```

Build all plugins and generate marketplace.json:

```bash
bash builders/build-claude-marketplace.sh
```

### Codex build

Generate Codex manifests from Claude manifests, then export skill folders:

```bash
bash builders/sync-codex-manifests.sh
bash builders/build-codex-skills.sh
```

### install-plugin.sh

Install built plugins to `~/.claude/plugins/lamella/`:

```bash
./install.sh --list
./install.sh core typescript python
./install.sh --all
./install.sh --dry-run --all
./install.sh --uninstall security
```

## Validation

```bash
make validate          # Source validators (7 scripts)
node scripts/ci/validate-build.js  # Post-build validator
```

## Environment Variables

- `CLAUDE_HOME` — Installation directory (default: `~/.claude`)

## Requirements

- bash 4+
- jq (for JSON processing)
- Node.js (for validators)

## License

MIT
