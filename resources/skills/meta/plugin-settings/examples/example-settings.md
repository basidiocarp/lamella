# Example Plugin Settings File

## Template: Basic Configuration

**.claude/my-plugin.local.md:**

```markdown
---
enabled: true
mode: standard
---

# My Plugin Configuration

Plugin is active in standard mode.
```

## Template: Advanced Configuration

**.claude/my-plugin.local.md:**

```markdown
---
enabled: true
strict_mode: false
max_file_size: 1000000
allowed_extensions: [".js", ".ts", ".tsx"]
// ... (16 lines trimmed)
## Additional Notes

Contact @team-lead with questions about this configuration.
```

## Template: Agent State File

**.claude/multi-agent-swarm.local.md:**

```markdown
---
agent_name: database-implementation
task_number: 4.2
pr_number: 5678
coordinator_session: team-leader
// ... (27 lines trimmed)
- Task 4.1: Data model design

Report status to coordinator session 'team-leader'.
```

## Template: Feature Flag Pattern

**.claude/experimental-features.local.md:**

```markdown
---
enabled: true
features:
  - ai_suggestions
  - auto_formatting
// ... (9 lines trimmed)
- Advanced refactoring tools

Experimental mode is OFF (stable features only).
```

## Usage in Hooks

These templates can be read by hooks:

```bash
# Check if plugin is configured
if [[ ! -f ".claude/my-plugin.local.md" ]]; then
  exit 0  # Not configured, skip hook
fi

# Read settings
FRONTMATTER=$(sed -n '/^---$/,/^---$/{ /^---$/d; p; }' ".claude/my-plugin.local.md")
ENABLED=$(echo "$FRONTMATTER" | grep '^enabled:' | sed 's/enabled: *//')

# Apply settings
if [[ "$ENABLED" == "true" ]]; then
  # Hook is active
  # ...
fi
```

## Gitignore

Always add to project `.gitignore`:

```gitignore
# Plugin settings (user-local, not committed)
.claude/*.local.md
.claude/*.local.json
```

## Editing Settings

Users can edit settings files manually:

```bash
# Edit settings
vim .claude/my-plugin.local.md

# Changes take effect after restart
exit  # Exit Claude Code
claude  # Restart
```

Changes require Claude Code restart - hooks can't be hot-swapped.
