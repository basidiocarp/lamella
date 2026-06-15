---
name: plugin-settings
description: "Documents the `.claude/plugin-name.local.md` pattern for plugin-specific configuration."
origin: lamella
---
# Plugin Settings Pattern for Claude Code Plugins


## Contents

- [Overview](#overview)
- [File Structure](#file-structure)
- [Reading Settings Files](#reading-settings-files)
- [Parsing Techniques](#parsing-techniques)
- [Best Practices](#best-practices)
- [Quick Reference](#quick-reference)
- [Additional Resources](#additional-resources)


## Overview

Plugins can store user-configurable settings and state in `.claude/plugin-name.local.md` files within the project directory. This pattern uses YAML frontmatter for structured configuration and markdown content for prompts or additional context.

**Key characteristics:**
- File location: `.claude/plugin-name.local.md` in project root
- Structure: YAML frontmatter + markdown body
- Purpose: Per-project plugin configuration and state
- Usage: Read from hooks, commands, and agents
- Lifecycle: User-managed (not in git, should be in `.gitignore`)

## File Structure

### Basic Template

```markdown
---
enabled: true
setting1: value1
setting2: value2
numeric_setting: 42
list_setting: ["item1", "item2"]
---

# Additional Context

This markdown body can contain:
- Task descriptions
- Additional instructions
- Prompts to feed back to Claude
- Documentation or notes
```

### Example: Plugin State File

**.claude/my-plugin.local.md:**
```markdown
---
enabled: true
strict_mode: false
max_retries: 3
notification_level: info
coordinator_session: team-leader
---

# Plugin Configuration

This plugin is configured for standard validation mode.
```

## Reading Settings Files

### From Hooks (Bash Scripts)

```bash
#!/bin/bash
set -euo pipefail

STATE_FILE=".claude/my-plugin.local.md"

mkdir -p "$(dirname "$STATE_FILE")"

ENABLED=$(awk -F': ' '/^enabled:/ {print $2}' "$STATE_FILE" 2>/dev/null || true)
PROFILE=$(awk -F': ' '/^profile:/ {print $2}' "$STATE_FILE" 2>/dev/null || true)

if [[ -z "${ENABLED:-}" ]]; then
  ENABLED="true"
fi

if [[ "$ENABLED" != "true" ]]; then
  exit 0  # Disabled
fi
```

### From Commands

Commands can read settings files to customize behavior by checking `.claude/my-plugin.local.md`, reading configuration, and applying settings to processing logic.

### From Agents

Agents can reference settings in their instructions by checking for settings file presence and adapting behavior according to the configuration fields.

## Parsing Techniques

### Extract Frontmatter

```bash
FRONTMATTER=$(sed -n '/^---$/,/^---$/{ /^---$/d; p; }' "$FILE")
```

### Read Individual Fields

```bash
# String fields
VALUE=$(echo "$FRONTMATTER" | grep '^field_name:' | sed 's/field_name: *//' | sed 's/^"\(.*\)"$/\1/')

# Boolean fields
ENABLED=$(echo "$FRONTMATTER" | grep '^enabled:' | sed 's/enabled: *//')

# Numeric fields
MAX=$(echo "$FRONTMATTER" | grep '^max_value:' | sed 's/max_value: *//')
```

### Read Markdown Body

```bash
# Get everything after closing ---
BODY=$(awk '/^---$/{i++; next} i>=2' "$FILE")
```

## Best Practices

### File Naming

✅ **DO:** Use `.claude/plugin-name.local.md` format, match plugin name exactly, use `.local.md` suffix
❌ **DON'T:** Use different directory, inconsistent naming, or `.md` without `.local`

### Gitignore

Always add to `.gitignore`:
```gitignore
.claude/*.local.md
.claude/*.local.json
```

### Defaults

Provide sensible defaults when settings file doesn't exist:
```bash
if [[ ! -f "$STATE_FILE" ]]; then
  ENABLED=true
  MODE=standard
fi
```

### Validation

Validate settings values before use:
```bash
if ! [[ "$MAX" =~ ^[0-9]+$ ]] || [[ $MAX -lt 1 ]] || [[ $MAX -gt 100 ]]; then
  MAX=10  # Use default
fi
```

### Restart Requirement

**Important:** Settings changes require Claude Code restart. Document this in your README.

## Quick Reference

### File Location

```
project-root/
└── .claude/
    └── plugin-name.local.md
```

### Quick Exit Pattern

```bash
if [[ ! -f ".claude/my-plugin.local.md" ]]; then
  exit 0  # Not configured
fi
```

## Additional Resources

### Local References

- [references/examples.md](references/examples.md) - Common patterns, real-world examples, and security considerations

### Implementation Workflow

To add settings to a plugin:

1. Design settings schema (which fields, types, defaults)
2. Create template file in plugin documentation
3. Add gitignore entry for `.claude/*.local.md`
4. Implement settings parsing in hooks/commands
5. Use quick-exit pattern (check file exists, check enabled field)
6. Document settings in plugin README with template
7. Remind users that changes require Claude Code restart
### Additional Resources

- [Parsing Techniques](references/parsing-techniques.md)
- [Real World Examples](references/real-world-examples.md)
- [Parse Frontmatter](scripts/parse-frontmatter.sh)
- [Validate Settings](scripts/validate-settings.sh)
