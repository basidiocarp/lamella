# Skill-Issue Architecture

How the system fits together — for new users and contributors.

## Core Concept

Skill-Issue is a modular plugin system for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). It packages curated skills, agents, commands, rules, hooks, workflows, and templates into installable plugins that follow the **official Claude Code plugin format**.

Users pick plugins matching their tech stack (e.g., `core` + `python` + `security`), build them, and install to `~/.claude/plugins/lamella/` — or add the built marketplace directly in Claude Code.

## Build & Install Pipeline

```mermaid
flowchart LR
    A["resources/\nskills/\nagents/\ncommands/\n..."] -->|referenced by| B[manifests/claude/*.json]
    B -->|read by| C[build-claude-plugin.sh]
    C -->|flattens into| D[dist/plugins/name/]
    D -->|.claude-plugin/plugin.json| E[Official Claude Code Plugin]
    F[build-claude-marketplace.sh] -->|generates| G[dist/.claude-plugin/marketplace.json]
    E -->|installed via| H[/plugin marketplace add ./dist]
```

### How it works

1. **Source resources** live in `resources/` subdirectories organized by category (`resources/skills/core/`, `resources/agents/code-quality/`, etc.)
2. **Plugin manifests** (`manifests/claude/*.json`) declare which resources belong to each plugin
3. **`build-claude-plugin.sh`** reads a manifest and:
   - Generates `.claude-plugin/plugin.json` (official format)
   - Flattens agents: `resources/agents/code-quality/code-reviewer.md` → `agents/code-reviewer.md`
   - Flattens commands: `resources/commands/development/commit.md` → `commands/commit.md`
   - Flattens skills: `resources/skills/core/brainstorming/` → `skills/brainstorming/`
   - Bundles hooks with `resources/hooks/hooks.json`
   - Puts non-plugin resources (rules, workflows, templates) in `_standalone/`
4. **`build-claude-marketplace.sh`** builds all plugins and generates `marketplace.json`
5. **`install.sh`** copies plugins to `~/.claude/plugins/lamella/<name>/`

## Directory Structure

```
lamella/
├── resources/
│   ├── skills/           # 230 skill directories (source, by category)
│   ├── agents/           # 175 agent markdown files (source, by category)
│   ├── commands/         # 213 slash commands (source, by category)
│   ├── hooks/            # Event hook configs (JSON)
│   ├── rules/            # Project rules (common/, typescript/, python/, etc.)
│   ├── templates/        # Session, docs, claude config templates
│   ├── workflows/        # Development, quality, release workflows
│   ├── mcp-configs/      # MCP server configurations
│   └── scripts/          # Hook scripts referenced by hooks.json
├── manifests/
│   ├── claude/           # JSON manifests — source of truth
│   │   ├── schema.json   # JSON Schema for manifest validation
│   │   ├── index.json    # Plugin registry
│   │   └── *.json        # 20 individual plugin manifests
│   └── codex/            # Codex export manifests
├── builders/             # Builder scripts
│   ├── build-claude-plugin.sh
│   ├── build-claude-marketplace.sh
│   └── ...
├── scripts/
│   ├── ci/               # 8 validation scripts
│   ├── plugins/          # build-plugin.sh, build-marketplace.sh, install-plugin.sh
│   └── ...
├── dist/                 # Built output (generated, gitignored)
│   ├── .claude-plugin/
│   │   └── marketplace.json
│   └── plugins/<name>/
│       ├── .claude-plugin/plugin.json
│       ├── agents/*.md
│       ├── commands/*.md
│       ├── skills/*/SKILL.md
│       └── hooks/hooks.json
└── docs/                 # Documentation
```

## Resource Types

| Type | Source Location | Built Location | Purpose |
|------|---------------|----------------|---------|
| **Skills** | `resources/skills/<cat>/<name>/SKILL.md` | `skills/<name>/SKILL.md` | Domain-specific knowledge Claude loads on-demand |
| **Agents** | `resources/agents/<cat>/<name>.md` | `agents/<name>.md` | Specialized sub-agents with roles, models, tool access |
| **Commands** | `resources/commands/<cat>/<name>.md` | `commands/<name>.md` | Slash commands users invoke directly |
| **Hooks** | `resources/hooks/hooks.json` | `hooks/hooks.json` | Event-driven automation (session, tool-use, stop) |
| **Rules** | `resources/rules/<lang>/*.md` | `_standalone/rules/` | Always-loaded coding standards (not official plugin resource) |
| **Workflows** | `resources/workflows/*.md` | `_standalone/workflows/` | Multi-step process guides (not official plugin resource) |
| **Templates** | `resources/templates/` | `_standalone/templates/` | Reusable templates (not official plugin resource) |

## Plugin System

Each plugin is defined by a JSON manifest in `manifests/claude/`. The build pipeline transforms it into an official Claude Code plugin directory.

**Official plugin output format:**

```
dist/plugins/core/
├── .claude-plugin/
│   └── plugin.json       ← Official Claude Code manifest
├── agents/
│   ├── code-reviewer.md  ← Flattened from resources/agents/code-quality/
│   └── architect.md      ← Flattened from resources/agents/architecture/
├── commands/
│   └── commit.md         ← Flattened from resources/commands/development/
├── skills/
│   ├── brainstorming/    ← Flattened from resources/skills/core/
│   │   └── SKILL.md
│   └── systematic-debugging/
│       └── SKILL.md
└── hooks/
    └── hooks.json
```

**Usage:**

```bash
# Build all plugins as a marketplace
make build-marketplace

# Add the marketplace in Claude Code
/plugin marketplace add ./dist

# Or test a single plugin
claude --plugin-dir dist/plugins/core

# Or install to ~/.claude/plugins/
./install.sh core python typescript
```

Common plugin combinations:

- `core` — foundational skills and rules everyone needs
- `core` + `typescript` + `frontend` — web development
- `core` + `python` + `ai-agents` — Python AI/ML work
- `core` + `security` + `devops` — infrastructure focus

## Validation

8 CI scripts in `scripts/ci/` enforce structural rules:

| Validator | Checks |
|-----------|--------|
| `validate-agents.js` | Agent frontmatter (name, description, model) |
| `validate-commands.js` | Command structure and skill references |
| `validate-hooks.js` | Hook events, types, matchers |
| `validate-rules.js` | Rule formatting |
| `validate-skills.js` | Skill directories and SKILL.md presence |
| `validate-manifests.js` | Manifest resources exist on disk |
| `validate-xrefs.js` | Cross-references between resources |
| `validate-build.js` | Built plugin output integrity (post-build) |

```bash
make validate                    # Run source validators
node scripts/ci/validate-build.js  # Run post-build validator
```

## Contributing

1. Add or edit resources in the appropriate `resources/` subdirectory
2. Reference new resources in the relevant plugin manifest(s) under `manifests/claude/`
3. Run `make validate` to check for errors
4. Run `make build-marketplace` to build all plugins
5. Test with `claude --plugin-dir dist/plugins/<name>`
