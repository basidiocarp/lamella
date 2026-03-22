# Hook Configuration

Complete reference for hook configuration options.

## Hook locations

Where you define a hook determines its scope:

| Location | Scope | Shareable |
|:---------|:------|:----------|
| `~/.claude/settings.json` | All your projects | No, local to your machine |
| `.claude/settings.json` | Single project | Yes, can be committed to the repo |
| `.claude/settings.local.json` | Single project | No, gitignored |
| Managed policy settings | Organization-wide | Yes, admin-controlled |
| Plugin `hooks/hooks.json` | When plugin is enabled | Yes, bundled with the plugin |
| Skill or agent frontmatter | While the component is active | Yes, defined in the component file |

## Matcher patterns

The `matcher` field is a regex string that filters when hooks fire. Use `"*"`, `""`, or omit `matcher` entirely to match all occurrences.

| Event | What the matcher filters | Example values |
|:------|:------------------------|:---------------|
| `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest` | tool name | `Bash`, `Edit\|Write`, `mcp__.*` |
| `SessionStart` | how the session started | `startup`, `resume`, `clear`, `compact` |
| `SessionEnd` | why the session ended | `clear`, `logout`, `prompt_input_exit`, `other` |
| `Notification` | notification type | `permission_prompt`, `idle_prompt`, `auth_success` |
| `SubagentStart`, `SubagentStop` | agent type | `Bash`, `Explore`, `Plan`, or custom agent names |
| `PreCompact` | what triggered compaction | `manual`, `auto` |
| `UserPromptSubmit`, `Stop` | no matcher support | always fires on every occurrence |

## Hook handler fields

### Common fields (all hook types)

| Field | Required | Description |
|:------|:---------|:------------|
| `type` | yes | `"command"`, `"prompt"`, or `"agent"` |
| `timeout` | no | Seconds before canceling. Defaults: 600 for command, 30 for prompt, 60 for agent |
| `statusMessage` | no | Custom spinner message displayed while the hook runs |
| `once` | no | If `true`, runs only once per session then is removed. Skills only |

### Command hook fields

| Field | Required | Description |
|:------|:---------|:------------|
| `command` | yes | Shell command to execute |
| `async` | no | If `true`, runs in the background without blocking |

### Prompt and agent hook fields

| Field | Required | Description |
|:------|:---------|:------------|
| `prompt` | yes | Prompt text to send to the model. Use `$ARGUMENTS` for hook input JSON |
| `model` | no | Model to use for evaluation. Defaults to a fast model |

## Reference scripts by path

Use environment variables to reference hook scripts:

- `$CLAUDE_PROJECT_DIR` — the project root
- `${CLAUDE_PLUGIN_ROOT}` — the plugin's root directory (for plugin hooks)

Example:
```json
{
  "type": "command",
  "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-style.sh"
}
```

## Hooks in skills and agents

Hooks can be defined in skill or agent frontmatter:

```yaml
---
name: secure-operations
description: Perform operations with security checks
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/security-check.sh"
---
```

## The `/hooks` menu

Type `/hooks` in Claude Code to:
- View all configured hooks
- Add new hooks interactively
- Delete existing hooks
- Toggle all hooks on/off

Each hook is labeled with its source: `[User]`, `[Project]`, `[Local]`, or `[Plugin]`.

## Disable or remove hooks

- Delete the entry from the settings JSON file, or use `/hooks` menu
- Set `"disableAllHooks": true` in settings to disable all hooks temporarily
- Use the toggle in `/hooks` menu for quick enable/disable

**Note:** Direct edits to settings files don't take effect until you review them in `/hooks` or restart your session.

## See also

- [getting-started.md](getting-started.md) — First hook setup
- [hook-events.md](hook-events.md) — Event schemas
- [input-output.md](input-output.md) — I/O formats
