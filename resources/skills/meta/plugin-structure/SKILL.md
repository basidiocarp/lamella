---
name: plugin-structure
description: "Guides Claude Code plugin architecture and directory structure."
origin: lamella
---
# Plugin Structure for Claude Code


## Contents

- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [Plugin Manifest (plugin.json)](#plugin-manifest-pluginjson)
- [Component Organization](#component-organization)
- [File Naming Conventions](#file-naming-conventions)
- [Auto-Discovery Mechanism](#auto-discovery-mechanism)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)


## Overview

Claude Code plugins follow a standardized directory structure with automatic component discovery. Understanding this structure enables creating well-organized, maintainable plugins that integrate seamlessly with Claude Code.

**Key concepts:**
- Conventional directory layout for automatic discovery
- Manifest-driven configuration in `.claude-plugin/plugin.json`
- Component-based organization (commands, agents, skills, hooks)
- Portable path references using `${CLAUDE_PLUGIN_ROOT}`
- Explicit vs. auto-discovered component loading

## Directory Structure

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # Required: Plugin manifest
├── commands/                 # Slash commands (.md files)
├── agents/                   # Subagent definitions (.md files)
├── skills/                   # Agent skills (subdirectories)
│   └── skill-name/
│       └── SKILL.md         # Required for each skill
├── hooks/
│   └── hooks.json           # Event handler configuration
├── .mcp.json                # MCP server definitions
└── scripts/                 # Helper scripts and utilities
```

**Critical rules:**

1. **Manifest location**: The `plugin.json` manifest MUST be in `.claude-plugin/` directory
2. **Component locations**: All component directories MUST be at plugin root level, NOT nested inside `.claude-plugin/`
3. **Optional components**: Only create directories for components the plugin actually uses
4. **Naming convention**: Use kebab-case for all directory and file names

## Plugin Manifest (plugin.json)

### Required Fields

```json
{
  "name": "plugin-name"
}
```

**Name requirements:** Use kebab-case, must be unique, no spaces or special characters.

### Recommended Metadata

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "Brief explanation of plugin purpose",
  "author": { "name": "Author Name" },
  "license": "MIT",
  "keywords": ["testing", "automation"]
}
```

### Component Path Configuration

```json
{
  "name": "plugin-name",
  "commands": "./custom-commands",
  "agents": ["./agents", "./specialized-agents"],
  "hooks": "./config/hooks.json",
  "mcpServers": "./.mcp.json"
}
```

Custom paths supplement defaults—they don't replace them.

## Component Organization

| Component | Location | Format | Auto-Discovery |
|-----------|----------|--------|----------------|
| Commands | `commands/` | `.md` files with YAML frontmatter | All `.md` files |
| Agents | `agents/` | `.md` files with YAML frontmatter | All `.md` files |
| Skills | `skills/*/` | Subdirectories with `SKILL.md` | All `SKILL.md` files |
| Hooks | `hooks/hooks.json` | JSON configuration | Via manifest |
| MCP Servers | `.mcp.json` | JSON configuration | Via manifest |

See [references/component-details.md](references/component-details.md) for detailed component specifications, examples, and portable path references using `${CLAUDE_PLUGIN_ROOT}`.

## File Naming Conventions

### Component Files

- **Commands**: kebab-case `.md` → `code-review.md` = `/code-review`
- **Agents**: kebab-case `.md` → `test-generator.md`
- **Skills**: kebab-case directories → `api-testing/`

### Supporting Files

- **Scripts**: `validate-input.sh`, `generate-report.py`
- **Documentation**: `api-reference.md`, `best-practices.md`
- **Configuration**: `hooks.json`, `.mcp.json`, `plugin.json`

## Auto-Discovery Mechanism

Claude Code automatically discovers and loads components:

1. **Plugin manifest**: Reads `.claude-plugin/plugin.json` when plugin enables
2. **Commands**: Scans `commands/` directory for `.md` files
3. **Agents**: Scans `agents/` directory for `.md` files
4. **Skills**: Scans `skills/` for subdirectories containing `SKILL.md`
5. **Hooks**: Loads configuration from `hooks/hooks.json` or manifest
6. **MCP servers**: Loads configuration from `.mcp.json` or manifest

**Discovery timing**: Changes take effect on next Claude Code session.

## Best Practices

### Organization
- Group related components together
- Keep `plugin.json` lean, rely on auto-discovery
- Include README files for documentation

### Naming
- Use consistent naming across related components
- Use descriptive names that indicate purpose
- Balance brevity with clarity

### Portability
- Always use `${CLAUDE_PLUGIN_ROOT}` for paths
- Test on multiple systems (macOS, Linux, Windows)
- Document dependencies
- Use portable bash/Python constructs

### Maintenance
- Version consistently in plugin.json
- Deprecate gracefully before removal
- Document breaking changes
- Test thoroughly after changes

## Troubleshooting

**Component not loading:**
- Verify file is in correct directory with correct extension
- Check YAML frontmatter syntax
- Ensure skill has `SKILL.md` (not `README.md`)
- Confirm plugin is enabled

**Path resolution errors:**
- Replace hardcoded paths with `${CLAUDE_PLUGIN_ROOT}`
- Verify paths are relative and start with `./`
- Test with `echo $CLAUDE_PLUGIN_ROOT` in hook scripts

**Auto-discovery not working:**
- Confirm directories are at plugin root (not in `.claude-plugin/`)
- Check file naming follows conventions
- Restart Claude Code to reload

### Local References

- [references/component-details.md](references/component-details.md) - Detailed component specs, examples, and common patterns

## Reference Files

- [Component Patterns](references/component-patterns.md)
- [Manifest Reference](references/manifest-reference.md)
