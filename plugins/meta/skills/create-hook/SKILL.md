---
name: create-hook
description: "Creates Claude Code hooks and matching repo guardrails."
metadata:
  argument-hint: Optional hook type or description of desired behavior
origin: lamella
---
# Create Hook Command

Analyze the project, suggest practical hooks, and create them with proper testing.

## Table of Contents

- [Task](#your-task-create-hook)
- [Workflow](#workflow)
- [Templates](#templates)
- [Quick Reference](#quick-reference)
- [Success Criteria](#success-criteria)
- [Reference Documentation](#reference-documentation)

## Your Task (/create-hook)

1. **Analyze environment** — Detect tooling and existing hooks
2. **Suggest hooks** — Based on project configuration
3. **Configure hook** — Ask targeted questions and create the script
4. **Test & validate** — Ensure the hook works correctly

## Workflow

### 1. Environment Analysis & Suggestions

Detect project tooling and suggest relevant hooks:

| Detection | Suggested Hook |
|:----------|:---------------|
| TypeScript (`tsconfig.json`) | Type-check files after editing |
| Prettier (`.prettierrc`) | Auto-format files after editing |
| ESLint (`.eslintrc.*`) | Lint and auto-fix after editing |
| `test` script in package.json | Run tests before stopping |
| Git repository | Add destructive-command guardrails and repo hygiene checks |

### 2. Hook Configuration

Start by asking: **"What should this hook do?"**

Then understand context from description and **only ask about unclear details**:

1. **Trigger timing**: PreToolUse (before, can block), PostToolUse (after), Stop (before completion)
2. **Scope**: Which tools/operations? (matcher pattern)
3. **Audience**: Claude-only guardrail or repo-wide workflow for every contributor?
4. **Action**: Command to run, or prompt/agent for LLM-based decisions
5. **Response**: What to do on success/failure?

### 3. Create Hook

Use appropriate template and add to `.claude/settings.json`:

```json
{
  "hooks": {
    "<EventName>": [
      {
        "matcher": "<pattern>",
        "hooks": [
          {
            "type": "command",
            "command": "<script-path-or-inline>"
          }
        ]
      }
    ]
  }
}
```

### 4. Test & Validate

1. Trigger the hook manually
2. Test both success and failure paths
3. Verify output appears correctly
4. Check edge cases

## Templates

### Block dangerous commands

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.command' | grep -qE '(rm -rf|sudo)' && echo 'Blocked' >&2 && exit 2 || exit 0"
      }]
    }]
  }
}
```

### Auto-format on save

Use a Node.js script with `execFileSync` instead of shell command substitution.
An unquoted `$(jq -r '.tool_input.file_path')` is a shell injection vector — a
path containing spaces, semicolons, or backticks would break the command or
execute arbitrary code. `execFileSync` passes the path as a literal argument
without invoking a shell.

```js
// scripts/hooks/post-edit-format.js
const { execFileSync } = require('child_process');
let d = '';
process.stdin.on('data', c => d += c);
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(d);
    const filePath = input.tool_input?.file_path;
    if (filePath && /\.(ts|tsx|js|jsx)$/.test(filePath)) {
      // Pass filePath as a separate argument — no shell, no injection risk.
      execFileSync('npx', ['prettier', '--write', filePath], { stdio: 'pipe' });
    }
  } catch { /* non-blocking */ }
  process.stdout.write(d);
});
```

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "node scripts/hooks/post-edit-format.js"
      }]
    }]
  }
}
```

### Verify tests before stopping

```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "agent",
        "prompt": "Verify all tests pass. Run test suite and check results. $ARGUMENTS",
        "timeout": 120
      }]
    }]
  }
}
```

### Desktop notifications

```json
{
  "hooks": {
    "Notification": [{
      "hooks": [{
        "type": "command",
        "command": "osascript -e 'display notification \"Claude needs attention\" with title \"Claude Code\"'"
      }]
    }]
  }
}
```

### Git safety guardrail

Use the bundled scripts in `scripts/block-dangerous-git.sh` or
`scripts/block-dangerous-git.ps1` when you need to block destructive git
commands before Claude runs them. Copy the script into the target
`.claude/hooks/` directory first, then point the hook at that copied path.

## Quick Reference

### Hook Events

| Event | When | Can Block? |
|:------|:-----|:-----------|
| `SessionStart` | Session begins | No |
| `UserPromptSubmit` | Prompt submitted | Yes |
| `PreToolUse` | Before tool runs | Yes |
| `PermissionRequest` | Permission dialog shown | Yes |
| `PostToolUse` | After tool succeeds | No (feedback only) |
| `PostToolUseFailure` | After tool fails | No |
| `Stop` | Claude finishes | Yes |
| `SubagentStart/Stop` | Subagent lifecycle | Varies |
| `SessionEnd` | Session ends | No |

### Hook Types

| Type | Use Case |
|:-----|:---------|
| `command` | Run shell script |
| `prompt` | Single LLM judgment call |
| `agent` | Multi-turn verification with tools |

### Exit Codes

| Code | Meaning |
|:-----|:--------|
| 0 | Success, proceed |
| 2 | Block action, stderr → Claude |
| Other | Non-blocking error |

### JSON Decision Control

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Explanation"
  }
}
```

## Success Criteria

- [ ] Hook triggers on expected events
- [ ] Correct matcher pattern (tool name, event source)
- [ ] Proper exit codes (0 for allow, 2 for block)
- [ ] stderr message explains blocked actions
- [ ] JSON output valid when using structured control
- [ ] No infinite loops (check `stop_hook_active` for Stop hooks)

## Reference Documentation

For detailed information, see:

| Topic | Reference |
|:------|:----------|
| First hook setup | [references/getting-started.md](references/getting-started.md) |
| Common patterns | [references/examples.md](references/examples.md) |
| Repo guardrails | [references/repo-guardrails.md](references/repo-guardrails.md) |
| Configuration options | [references/configuration.md](references/configuration.md) |
| Event schemas | [references/hook-events.md](references/hook-events.md) |
| I/O formats | [references/input-output.md](references/input-output.md) |
| Prompt/agent hooks, security | [references/advanced.md](references/advanced.md) |
| Debug & fixes | [references/troubleshooting.md](references/troubleshooting.md) |

## External Resources

- [Claude Code Hooks Guide](https://docs.anthropic.com/en/docs/claude-code/hooks-guide)
- [Hooks Reference](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Bash command validator example](https://github.com/anthropics/claude-code/blob/main/examples/hooks/bash_command_validator_example.py)
