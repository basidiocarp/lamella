# Example Plugin Settings File

Small example settings files for `.local.md` plugin configuration.

## Basic Configuration

```markdown
---
enabled: true
mode: standard
---

# My Plugin Configuration

Plugin is active in standard mode.
```

## Advanced Configuration

```markdown
---
enabled: true
strict_mode: false
max_file_size: 1000000
allowed_extensions: [".js", ".ts", ".tsx"]
---

# My Plugin Configuration

Allow large TypeScript files but keep strict mode disabled.
```

## Agent State Example

```markdown
---
agent_name: database-implementation
task_number: 4.2
pr_number: 5678
coordinator_session: team-leader
---

# Agent State

Working on task 4.2 and reporting back to the coordinator session.
```

## Feature Flag Example

```markdown
---
enabled: true
features:
  - ai_suggestions
  - auto_formatting
---

# Experimental Features

Only the listed features are enabled.
```

## Gitignore Reminder

```gitignore
.claude/*.local.md
.claude/*.local.json
```
