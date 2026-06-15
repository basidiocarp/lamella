# YAML Frontmatter Reference

Complete reference for YAML frontmatter fields in Claude Code slash commands.

## description

**Purpose:** Brief description shown in `/help`
**Type:** String
**Default:** First line of command prompt

```yaml
---
description: Review pull request for code quality
---
```

**Best practice:** Clear, actionable description (under 60 characters)

## allowed-tools

**Purpose:** Specify which tools command can use
**Type:** String or Array
**Default:** Inherits from conversation

```yaml
---
allowed-tools: Read, Write, Edit, Bash(git:*)
---
```

**Patterns:**
- `Read, Write, Edit` - Specific tools
- `Bash(git:*)` - Bash with git commands only
- `*` - All tools (rarely needed)

**Use when:** Command requires specific tool access

## model

**Purpose:** Specify model for command execution
**Type:** String (sonnet, opus, haiku)
**Default:** Inherits from conversation

```yaml
---
model: haiku
---
```

**Use cases:**
- `haiku` - Fast, simple commands
- `sonnet` - Standard workflows
- `opus` - Complex analysis

## argument-hint

**Purpose:** Document expected arguments for autocomplete
**Type:** String
**Default:** None

```yaml
---
argument-hint: [pr-number] [priority] [assignee]
---
```

**Benefits:**
- Helps users understand command arguments
- Improves command discovery
- Documents command interface

## disable-model-invocation

**Purpose:** Prevent SlashCommand tool from programmatically calling command
**Type:** Boolean
**Default:** false

```yaml
---
disable-model-invocation: true
---
```

**Use when:** Command should only be manually invoked

## Complete Example

```yaml
---
description: Review pull request with specified priority
allowed-tools: Read, Grep, Bash(git:*, gh:*)
model: sonnet
argument-hint: [pr-number] [priority]
disable-model-invocation: false
---
```

## Field Summary Table

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `description` | string | First line | Help text |
| `allowed-tools` | string/array | Inherited | Tool access |
| `model` | string | Inherited | Model selection |
| `argument-hint` | string | None | Argument docs |
| `disable-model-invocation` | boolean | false | Block programmatic calls |
