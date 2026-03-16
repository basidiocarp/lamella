# Contributing to Skill-Issue

A modular plugin system for Claude Code with 230+ curated skills across 21 plugins. This guide covers how to add skills, agents, commands, and submit changes.

## Project Structure

| Directory | Contents |
|-----------|----------|
| `skills/` | Skill definitions (folder per skill) |
| `agents/` | Agent markdown files with YAML frontmatter |
| `commands/` | Slash command markdown files with YAML frontmatter |
| `hooks/` | Event hook configurations |
| `rules/` | Project rules markdown files |
| `plugin-manifests/` | JSON plugin manifests |
| `scripts/ci/` | Validation scripts |
| `scripts/plugins/` | Build and install scripts |

## Adding a Skill

Each skill is a directory under `skills/<category>/` containing at minimum a `SKILL.md`.

```
skills/my-category/my-skill/
├── SKILL.md          # Required — main skill file
├── reference.md      # Optional reference docs
└── templates/        # Optional templates
```

**SKILL.md frontmatter** (required fields: `description`):

```yaml
---
description: What this skill does
triggers:
  - when to activate this skill
dependencies: []
---
```

After creating the skill directory, register it in the appropriate plugin manifest under `plugin-manifests/`. Add an entry to the `resources.skills` array with the skill's relative path.

## Adding an Agent

Create a markdown file under `agents/<category>/` with the required YAML frontmatter.

**Required fields:** `name`, `description`

```yaml
---
name: my-agent
description: What this agent does
model: sonnet  # optional, defaults to inherit
tools: Read, Write, Bash  # optional
---

Agent instructions go here as markdown body.
```

If the agent belongs to a plugin, add it to the plugin manifest's `resources.agents` array.

## Adding a Command

Create a markdown file under `commands/<category>/` with YAML frontmatter.

**Required field:** `description`

```yaml
---
description: What the command does
---

Command instructions go here.
```

Organize commands into the existing category directories. Use a descriptive filename that matches the slash command name (e.g., `commands/debugging/trace.md` for `/trace`).

## Plugin Manifests

Each plugin manifest in `plugin-manifests/` is a JSON file with this structure:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "What this plugin provides",
  "resources": {
    "skills": ["skills/category/my-skill"],
    "agents": ["agents/category/my-agent.md"],
    "commands": ["commands/category/my-command.md"],
    "rules": []
  }
}
```

When you add a new skill, agent, or command, update the relevant manifest so it gets included in builds.

## Validation

Run all validators before submitting a PR:

```bash
node scripts/ci/validate-skills.js
node scripts/ci/validate-agents.js
node scripts/ci/validate-commands.js
node scripts/ci/validate-hooks.js
node scripts/ci/validate-rules.js
```

Fix any reported errors — CI will block merges with validation failures.

## Building & Testing Plugins

Build a plugin from its manifest:

```bash
bash scripts/plugins/build-plugin.sh plugin-manifests/core.json
```

Install a built plugin locally to test:

```bash
./scripts/plugins/install-plugin.sh core
```

Verify the installed plugin works as expected before submitting.

## Code Style

- **Keep files focused.** One skill, agent, or command per file.
- **Use descriptive names.** Filenames and directory names should clearly convey purpose.
- **Frontmatter first.** Every skill, agent, and command file must start with valid YAML frontmatter.
- **Markdown body.** Instructions, prompts, and documentation go in the markdown body after frontmatter.
- **No hardcoded paths.** Use relative paths in manifests and references.

## PR Process

1. Create a feature branch from `main`.
2. Make your changes — add skills, agents, commands, or fix issues.
3. Run all validators (see above).
4. Build and test affected plugins locally.
5. Commit using [conventional commits](https://www.conventionalcommits.org/):

```
feat: add code-review skill to core plugin
fix: correct agent frontmatter in security-reviewer
docs: update skill reference for playwright
```

6. Open a PR with a clear description of what was added or changed.
7. Ensure CI passes before requesting review.
