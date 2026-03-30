# Lamella

Plugin system for Claude Code: skills, agents, commands, hooks, and rules
packaged into installable plugins via a build pipeline.

## Build & Test

```bash
make validate              # Validate all source resources
make build-marketplace     # Build all plugins into dist/
make build PLUGIN=core     # Build a single plugin

# Test a built plugin
claude --plugin-dir dist/plugins/core

# Install plugins to ~/.claude/plugins/
./install.sh core python typescript
```

## Directory Layout

```
lamella/
  resources/                            # All plugin content
    agents/<category>/<name>.md         # ~130 agents organized by role
    commands/<category>/<name>.md       # Slash commands
    hooks/hooks.json                    # Event-driven automation config
    mcp-configs/                        # MCP server configurations
    rules/<lang>/*.md                   # Always-on coding standards
    skills/<category>/<name>/SKILL.md   # 230+ skills organized by domain
    templates/                          # Reusable templates
    workflows/*.md                      # Multi-step process guides
  manifests/
    claude/*.json                       # Plugin manifests (source of truth)
    codex/*.yaml                        # Codex skill manifests
  builders/                             # Build scripts (claude, codex)
  scripts/
    ci/                                 # 8 validation scripts
    hooks/                              # Hook scripts referenced by hooks.json
    plugins/                            # build-plugin.sh, build-marketplace.sh, install-plugin.sh
  config/                               # LSP configs
  schemas/                              # JSON schemas for manifests
  tools/                                # skills-ref CLI
  docs/                                 # Reference documentation
  dist/                                 # Built output (gitignored)
```

Build flattens category subdirectories:
`resources/skills/core/brainstorming/` -> `dist/plugins/core/skills/brainstorming/`

## Authoring Reference

Consult these docs before creating or editing skills, agents, commands, or hooks:

| Doc | When to Read |
|-----|--------------|
| [docs/authoring/skills-spec.md](docs/authoring/skills-spec.md) | **Always** -- the official Agent Skills format spec (frontmatter fields, validation rules, directory structure) |
| [docs/authoring/best-practices.md](docs/authoring/best-practices.md) | **Always** -- Anthropic's authoring guide (conciseness, degrees of freedom, progressive disclosure, testing) |
| [docs/authoring/writing-specs-for-agents.md](docs/authoring/writing-specs-for-agents.md) | When designing skill structure -- six core areas, three-tier boundaries, modular context, self-verification |
| [docs/authoring/agent-style-guide.md](docs/authoring/agent-style-guide.md) | **Always when editing agents** -- voice rules, body skeleton, section order, size targets, color scheme |
| [docs/getting-started/categorizing-skills.md](docs/getting-started/categorizing-skills.md) | When deciding whether content is a Rule, Workflow, or Skill |
| [docs/reference/skills.md](docs/reference/skills.md) | When using advanced features -- invocation control, subagent execution, dynamic context injection |
| [docs/reference/subagents.md](docs/reference/subagents.md) | When creating agents -- frontmatter, built-in agents, tool restrictions, triggering patterns |
| [docs/reference/hooks.md](docs/reference/hooks.md) | When creating hooks -- all events, schemas, exit codes, async/HTTP/prompt hooks |
| [docs/reference/plugins.md](docs/reference/plugins.md) | When creating plugins -- manifest, namespacing, standalone vs plugin tradeoffs |
| [docs/reference/plugin-reference.md](docs/reference/plugin-reference.md) | When you need the full plugin technical spec -- component schemas, CLI commands |
| [docs/architecture.md](docs/architecture.md) | When you need to understand the build pipeline or overall system |

## Content Placement Rules

- **Always applies?** Short standard or checklist? -> `resources/rules/<lang>/`
- **Multi-step sequence with agent chain?** -> `resources/workflows/`
- **Deep domain knowledge or specialized techniques?** -> `resources/skills/<category>/`
- See [categorizing-skills.md](docs/getting-started/categorizing-skills.md) for the full decision tree.

## Skill Authoring Checklist

- [ ] `name` field: lowercase, hyphens, 1-64 chars, matches directory name
- [ ] `description` field: starts with action verb, includes trigger keywords, max 1024 chars
- [ ] SKILL.md body under 500 lines -- detail goes in `references/`
- [ ] References one level deep from SKILL.md (no chains A -> B -> C)
- [ ] Concrete examples, not abstract explanations
- [ ] Success criteria or verification step included
- [ ] Added to at least one plugin manifest in `manifests/claude/`

## Agent Authoring Checklist

See [agent-style-guide.md](docs/authoring/agent-style-guide.md) for full rules.

- [ ] `name`: 3-50 chars, lowercase + hyphens, starts/ends alphanumeric
- [ ] `description`: action verb first, includes trigger keywords, max 1024 chars
- [ ] `model`: opus (planning/research), sonnet (coding/review), haiku (lookup), inherit (default)
- [ ] `color`: blue/cyan/green/yellow/magenta/red per [color scheme](docs/authoring/agent-style-guide.md#color-scheme)
- [ ] `tools`: least privilege -- list only tools the agent actually uses
- [ ] Body follows skeleton: Title + one-liner, Scope, Workflow, Boundaries, Output Format
- [ ] Second person imperative voice ("You analyze..." not "This agent analyzes...")
- [ ] No capability lists -- the base model already knows frameworks and tools
- [ ] Size within targets: 40-80 (executor), 60-150 (reviewer/architect), max 200 lines
- [ ] Added to at least one plugin manifest in `manifests/claude/`

## Three-Tier Boundary Pattern

When writing agent or skill boundaries, use three tiers:

```
Always Do:  Actions the agent takes without asking
Ask First:  Actions requiring human approval
Never Do:   Hard stops (commit secrets, edit vendor dirs, remove tests)
```

## Validation

8 CI validators enforce structural rules. Run before committing:

```bash
make validate
```

| Validator | Checks |
|-----------|--------|
| `validate-skills.js` | Skill directories, SKILL.md presence, frontmatter |
| `validate-subagents.js` | Shared subagent frontmatter and structure |
| `validate-commands.js` | Command structure and skill references |
| `validate-hooks.js` | Hook events, types, matchers |
| `validate-manifests.js` | Manifest resources exist on disk |
| `validate-xrefs.js` | Cross-references between resources |
| `validate-build.js` | Built plugin output integrity (post-build) |
