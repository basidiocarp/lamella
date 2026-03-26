# Hook Examples

Common patterns for automating Claude Code workflows with hooks.

## Desktop notifications

Send a macOS notification when Claude finishes a task or needs input:

```json
{
  "hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude needs attention\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

## Auto-format on save

Run Prettier after Claude writes or edits a file:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write $(jq -r '.tool_input.file_path')"
          }
        ]
      }
    ]
  }
}
```

## Protected files

Block edits to critical configuration files:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | grep -qE '(\\.env|package-lock\\.json)$' && echo 'Protected file' >&2 && exit 2 || exit 0"
          }
        ]
      }
    ]
  }
}
```

## Context injection on session start

Load recent git activity when starting a session:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo \"Recent commits:\n$(git log --oneline -5)\""
          }
        ]
      }
    ]
  }
}
```

## Log every Bash command

Track all shell commands Claude runs:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.command' >> ~/.claude/command-log.txt"
          }
        ]
      }
    ]
  }
}
```

## Match MCP tools

MCP tools use naming pattern `mcp__<server>__<tool>`. Match all tools from a server:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__github__.*",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"GitHub tool called: $(jq -r '.tool_name')\" >&2"
          }
        ]
      }
    ]
  }
}
```

## Clean up on session end

Remove temporary files when the session is cleared:

```json
{
  "hooks": {
    "SessionEnd": [
      {
        "matcher": "clear",
        "hooks": [
          {
            "type": "command",
            "command": "rm -f /tmp/claude-scratch-*.txt"
          }
        ]
      }
    ]
  }
}
```

## Block destructive commands

Prevent `rm -rf` and similar dangerous operations:

```bash
#!/bin/bash
# .claude/hooks/block-rm.sh
COMMAND=$(jq -r '.tool_input.command')

if echo "$COMMAND" | grep -q 'rm -rf'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Destructive command blocked by hook"
    }
  }'
else
  exit 0
fi
```

Hook configuration:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/block-rm.sh"
          }
        ]
      }
    ]
  }
}
```

## Block dangerous git commands

Use the bundled guardrail scripts when the policy is "Claude should not run
destructive git commands in this environment."

Project-scoped Bash example:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

Project-scoped PowerShell example:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "pwsh -NoProfile -File \"$CLAUDE_PROJECT_DIR/.claude/hooks/block-dangerous-git.ps1\""
          }
        ]
      }
    ]
  }
}
```

Copy the bundled script into `.claude/hooks/` before enabling the hook. See
[repo-guardrails.md](repo-guardrails.md) for setup and verification.

## Pair Claude hooks with repo-native pre-commit checks

Claude hooks are good for agent safety. Repo-native hooks are better when every
contributor should see the same check.

A practical split:

- Claude `PreToolUse` hook blocks dangerous commands or protected files.
- Repo-native pre-commit hook formats staged files and runs fast checks.

For JavaScript and TypeScript repos, a common repo-native hook stack is:

```text
lint-staged
typecheck
focused tests
```

Keep commit-time checks fast enough that the team will actually keep them
enabled.

## Prompt-based task completion check

Use an LLM to verify all tasks are complete before stopping:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Check if all tasks are complete. If not, respond with {\"ok\": false, \"reason\": \"what remains\"}."
          }
        ]
      }
    ]
  }
}
```

## Agent-based test verification

Spawn a subagent to verify tests pass before stopping:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "agent",
            "prompt": "Verify that all unit tests pass. Run the test suite and check the results. $ARGUMENTS",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

## Async test runner

Run tests in background after file changes:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
// ... (9 lines trimmed)
    ]
  }
}
```

## See also

- [getting-started.md](getting-started.md) — First hook setup
- [configuration.md](configuration.md) — Configuration options
- [hook-events.md](hook-events.md) — Event schemas
