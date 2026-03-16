# lamella

A modular plugin system for Claude Code with 230 curated skills across 20 specialized plugins.
Built plugins follow the **official Claude Code plugin format** (`.claude-plugin/plugin.json`).

## Quick Start

```bash
# Install specific plugins
./install.sh core python typescript

# Install all plugins
./install.sh --all

# List available plugins
./install.sh --list

# Or use the Makefile
make build-marketplace   # Build all plugins + marketplace.json
make install             # Build and install all
```

## As a Claude Code Marketplace

After building, the `dist/` directory is a proper Claude Code marketplace:

```bash
# Build the marketplace
make build-marketplace

# Add it in Claude Code
/plugin marketplace add ./dist

# Or load a single plugin for testing
claude --plugin-dir dist/plugins/core
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
├── plugin-manifests/     # Plugin definitions (JSON) — source of truth
│   ├── schema.json       # JSON Schema for validation
│   ├── index.json        # Plugin registry
│   └── *.json            # Individual plugin manifests
├── skills/               # All skills (source, organized by category)
├── agents/               # Agent definitions (source, by category)
├── commands/             # Slash commands (source, by category)
├── hooks/                # Event hooks
├── rules/                # Project rules
├── templates/            # Configuration and doc templates
├── workflows/            # Development and quality workflows
├── mcp-configs/          # MCP server configs
├── scripts/
│   ├── plugins/          # Build + install pipeline
│   │   ├── build-plugin.sh       # Build single plugin
│   │   ├── build-marketplace.sh  # Build all + marketplace.json
│   │   └── install-plugin.sh     # Install to ~/.claude/plugins/
│   ├── ci/               # Validators (8 scripts)
│   ├── hooks/            # Hook scripts
│   └── ...
├── dist/                 # Built output (gitignored)
│   ├── .claude-plugin/
│   │   └── marketplace.json      # Marketplace catalog
│   └── plugins/
│       ├── core/
│       │   ├── .claude-plugin/plugin.json  # Official plugin manifest
│       │   ├── agents/*.md                 # Flattened agents
│       │   ├── commands/*.md               # Flattened commands
│       │   ├── skills/*/SKILL.md           # Flattened skills
│       │   └── hooks/hooks.json            # Hook config
│       ├── typescript/
│       └── ...
└── docs/                 # Documentation
```

## Build Pipeline

The source organizes resources in category subdirectories (`agents/code-quality/code-reviewer.md`).
The build step flattens them into self-contained Claude Code plugin directories.

```
Source:  agents/code-quality/code-reviewer.md
         skills/core/brainstorming/SKILL.md
         
Built:   dist/plugins/core/agents/code-reviewer.md
         dist/plugins/core/skills/brainstorming/SKILL.md
         dist/plugins/core/.claude-plugin/plugin.json
```

### build-plugin.sh

Build one plugin from its manifest:

```bash
bash scripts/plugins/build-plugin.sh plugin-manifests/core.json
```

### build-marketplace.sh

Build all plugins and generate marketplace.json:

```bash
bash scripts/plugins/build-marketplace.sh
```

### install-plugin.sh

Install built plugins to `~/.claude/plugins/lamella/`:

```bash
./scripts/plugins/install-plugin.sh --list
./scripts/plugins/install-plugin.sh core typescript python
./scripts/plugins/install-plugin.sh --all
./scripts/plugins/install-plugin.sh --dry-run --all
./scripts/plugins/install-plugin.sh --uninstall security
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
