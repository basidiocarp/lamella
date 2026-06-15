---
name: command-development
description: "Guides slash command development for Claude Code."
origin: lamella
---
# Command Development for Claude Code

## Contents

- [Overview](#overview)
- [Command Basics](#command-basics)
- [File Format](#file-format)
- [Quick Reference](#quick-reference)
- [Templates](#templates)
- [Reference Files](#reference-files)

## Overview

Slash commands are Markdown files containing prompts that Claude executes when invoked. Commands provide reusability, consistency, and quick access to complex workflows.

**Key concepts:**
- Markdown file format with optional YAML frontmatter
- Dynamic arguments (`$1`, `$2`, `$ARGUMENTS`)
- File references (`@path/to/file`)
- Bash execution for context (`` !`commands` ``)
- Organization via flat or namespaced directories

## Command Basics

### Commands are Instructions FOR Claude

When a user invokes `/command-name`, the command content becomes Claude's instructions. Write commands as directives TO Claude:

**Correct:**
```markdown
Review this code for security vulnerabilities including:
- SQL injection
- XSS attacks
- Authentication issues

Provide specific line numbers and severity ratings.
```

**Incorrect:**
```markdown
This command will review your code for security issues.
You'll receive a report with vulnerability details.
```

### Command Locations

| Location | Scope | Label in /help | Use for |
|----------|-------|----------------|---------|
| `.claude/commands/` | Project | (project) | Team workflows |
| `~/.claude/commands/` | All projects | (user) | Personal utilities |
| `plugin/commands/` | Plugin | (plugin-name) | Plugin features |

## File Format

### Basic Command

```markdown
Review this code for security vulnerabilities including:
- SQL injection
- XSS attacks
- Authentication bypass
```

### With Frontmatter

```markdown
---
description: Review code for security issues
allowed-tools: Read, Grep, Bash(git:*)
model: sonnet
argument-hint: [file-path]
---

Review @$1 for security vulnerabilities...
```

## Quick Reference

### YAML Frontmatter Fields

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `description` | string | First line | Help text shown in `/help` |
| `allowed-tools` | string/array | Inherited | Tool access (e.g., `Bash(git:*)`) |
| `model` | string | Inherited | Model: haiku, sonnet, opus |
| `argument-hint` | string | None | Document expected arguments |
| `disable-model-invocation` | boolean | false | Block programmatic calls |

### Arguments

| Syntax | Description | Example |
|--------|-------------|---------|
| `$ARGUMENTS` | All arguments as string | `Fix #$ARGUMENTS` |
| `$1`, `$2`, `$3` | Positional arguments | `Deploy $1 to $2` |

### File References

| Pattern | Description | Example |
|---------|-------------|---------|
| `@$1` | Dynamic file from argument | `Review @$1` |
| `@path/file.ts` | Static file reference | `Check @package.json` |

### Bash Execution

```markdown
---
allowed-tools: Bash(git:*)
---

Files changed: !`git diff --name-only`
```

## Templates

### Review Command

```markdown
---
description: Review code changes
allowed-tools: Read, Bash(git:*)
---

Files changed: !`git diff --name-only`

Review each file for:
1. Code quality and style
2. Potential bugs
3. Test coverage
4. Documentation needs
```

### File Processing Command

```markdown
---
description: Process specific file
argument-hint: [file-path]
---

Analyze @$1 for:
- Code structure
- Best practices
- Improvements needed
```

### Validation Command

```markdown
---
description: Deploy with validation
argument-hint: [environment]
---

Validate: !`echo "$1" | grep -E "^(dev|staging|prod)$" || echo "INVALID"`

If valid: Deploy to $1
Otherwise: Show valid options (dev, staging, prod)
```

### Plugin Command

```markdown
---
description: Run plugin analyzer
allowed-tools: Bash(node:*)
---

Run: !`node ${CLAUDE_PLUGIN_ROOT}/scripts/analyze.js $1`
Config: @${CLAUDE_PLUGIN_ROOT}/config/settings.json

Report findings from analysis.
```

## Reference Files

Detailed documentation in `references/` directory:

- [references/yaml-frontmatter-reference.md](references/yaml-frontmatter-reference.md) - Complete YAML field specifications
- [references/arguments-file-references.md](references/arguments-file-references.md) - Arguments and file reference patterns
- [references/organization-bash.md](references/organization-bash.md) - Command organization and bash execution
- [references/best-practices-patterns.md](references/best-practices-patterns.md) - Design best practices and common patterns
- [references/troubleshooting.md](references/troubleshooting.md) - Common issues and solutions
- [references/plugin-integration.md](references/plugin-integration.md) - Plugin features, component integration, validation
### Additional Resources


| File | Path |
|------|------|
| [Advanced Workflows](references/advanced-workflows.md) | `references/advanced-workflows.md` |
| [Documentation Patterns](references/documentation-patterns.md) | `references/documentation-patterns.md` |
| [Interactive Commands](references/interactive-commands.md) | `references/interactive-commands.md` |
| [Marketplace Considerations](references/marketplace-considerations.md) | `references/marketplace-considerations.md` |
| [Plugin Features Reference](references/plugin-features-reference.md) | `references/plugin-features-reference.md` |
| [Testing Strategies](references/testing-strategies.md) | `references/testing-strategies.md` |
