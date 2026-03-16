---
description: List, view, and apply documentation templates
allowed-tools: Read, Write, Glob
argument-hint: "<list | show | use> [template-name] [--output path]"
---

# Documentation Templates

List, view, and apply documentation templates.

## Syntax

```
/docs-specialist:template <action> [options]
```

## Actions

- `list` - List all available templates
- `show` - View template details and structure
- `use` - Apply a template to generate documentation

---

## list

List all available documentation templates.

### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `--detailed` | No | Show template structure and variables |

### Output

```
Documentation Templates
=======================

Built-in Templates:
───────────────────
  readme          Project README with standard sections
  api-endpoint    REST API endpoint documentation
  component       UI component (React/Vue/Livewire) docs
  model           Database model/entity documentation
  service         Service class documentation
  guide           How-to guide or tutorial
  architecture    Architecture decision record (ADR)
  changelog       Release changelog entry

Use /docs-specialist:template show <name> for details
Use /docs-specialist:template use <name> to apply
```

### Examples

```bash
# List all templates
/docs-specialist:template list

# List with structure details
/docs-specialist:template list --detailed
```

---

## show

View template details, structure, and available variables.

### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `<name>` | Yes | Template name to show |

### Output Example

```
Template: api-endpoint
======================

Description:
  REST API endpoint documentation with request/response examples

Sections:
# ... (55 lines trimmed for brevity)
{{examples}}
───────────────────────────────────────────────
```

### Examples

```bash
# Show readme template
/docs-specialist:template show readme

# Show API endpoint template
/docs-specialist:template show api-endpoint

# Show component template
/docs-specialist:template show component
```

---

## use

Apply a template to generate documentation.

### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `<template>` | Yes | Template name to apply |
| `[target]` | No | File or path to document (for code-based templates) |
| `--output=<path>` | No | Output file path |
| `--vars=<json>` | No | Template variables as JSON string |
| `--interactive` | No | Prompt for missing variables (default if no target) |

### Process

1. **Load Template**
   - Get template structure and variables

2. **Gather Variables**
   - If `[target]` provided: analyze code to extract variables
   - If `--vars` provided: use provided values
   - If `--interactive`: prompt for each variable
   - Merge all sources (code analysis > provided > prompted)

3. **Generate Content**
   - Apply variables to template
   - Format according to style
   - Add code examples if applicable

4. **Output**
   - Write to `--output` path or suggest location
   - Show preview if interactive

### Examples

```bash
# Apply readme template interactively
/docs-specialist:template use readme

# Generate API doc for a specific endpoint
/docs-specialist:template use api-endpoint app/Http/Controllers/UserController.php@store

# Generate component docs
/docs-specialist:template use component src/components/Button.tsx

# Specify output location
/docs-specialist:template use model app/Models/User.php --output=docs/models/user.md

# Provide variables directly
/docs-specialist:template use guide --vars='{"title": "Getting Started", "level": "beginner"}'

# Generate architecture decision record
/docs-specialist:template use architecture --interactive
```

---

## Built-in Templates

### readme

Project README with standard sections.

**Structure:**
```markdown
# Project Name

Brief description of the project.

## Features

- Feature 1
# ... (25 lines trimmed for brevity)

License information.
```

**Variables:** `project_name`, `description`, `features`, `installation`, `usage`, `config_vars`, `license`

---

### api-endpoint

REST API endpoint documentation.

**Structure:**
```markdown
# METHOD /path/to/endpoint

Brief description.

## Authentication

Required/Optional. Token type.
# ... (41 lines trimmed for brevity)

- [Other Endpoint](./other.md)
```

**Variables:** `http_method`, `endpoint_path`, `description`, `auth_required`, `auth_type`, `parameters`, `request_body`, `response_body`, `error_codes`, `examples`

---

### component

UI component documentation (React/Vue/Livewire).

**Structure:**
```markdown
# ComponentName

Brief description of the component.

## Usage

\`\`\`jsx
# ... (45 lines trimmed for brevity)

- [Similar Component](./similar.md)
```

**Variables:** `component_name`, `description`, `framework`, `props`, `events`, `slots`, `examples`, `accessibility`

---

### model

Database model/entity documentation.

**Structure:**
```markdown
# ModelName

Brief description of what this model represents.

## Table

`table_name`
# ... (53 lines trimmed for brevity)
$posts = $user->posts;
\`\`\`
```

**Variables:** `model_name`, `table_name`, `description`, `properties`, `relationships`, `scopes`, `accessors`, `validation`, `events`

---

### service

Service class documentation.

**Structure:**
```markdown
# ServiceName

Brief description of the service's purpose.

## Dependencies

| Dependency | Purpose |
# ... (40 lines trimmed for brevity)
|-------|------|
| ServiceEvent | After action |
```

**Variables:** `service_name`, `description`, `dependencies`, `methods`, `config_options`, `events`

---

### guide

How-to guide or tutorial.

**Structure:**
```markdown
# How to [Do Something]

Brief description of what this guide covers.

## Prerequisites

Before you begin, ensure you have:
# ... (46 lines trimmed for brevity)

- [External Link](https://example.com)
```

**Variables:** `title`, `description`, `prerequisites`, `steps`, `verification`, `troubleshooting`, `next_steps`

---

### architecture

Architecture Decision Record (ADR).

**Structure:**
```markdown
# ADR-001: Decision Title

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded
**Deciders:** Names of people involved

## Context
# ... (35 lines trimmed for brevity)
- [ADR-000: Previous Decision](./adr-000.md)
- [External Reference](https://example.com)
```

**Variables:** `adr_number`, `title`, `date`, `status`, `deciders`, `context`, `decision`, `consequences`, `alternatives`

---

### changelog

Release changelog entry.

**Structure:**
```markdown
## [Version] - YYYY-MM-DD

### Added

- New feature 1
- New feature 2

# ... (19 lines trimmed for brevity)

- Security fix 1
```

**Variables:** `version`, `date`, `added`, `changed`, `deprecated`, `removed`, `fixed`, `security`

---

## Notes

- Templates are guidelines - customize output as needed
- Code analysis extracts as many variables as possible automatically
- Use `--interactive` when variables can't be inferred
- Templates follow common documentation standards
