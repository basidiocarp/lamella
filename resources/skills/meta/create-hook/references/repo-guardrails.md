# Repo Guardrails

Use this reference when the user wants hook behavior that should apply to all
contributors, not just Claude.

## Choose the right layer

Use a Claude Code hook when:

- The rule should only gate Claude's tool usage.
- The rule depends on Claude hook events such as `PreToolUse` or `Stop`.
- The workflow is personal or session-specific.

Use a repo-native hook when:

- Every contributor should see the same check at commit time.
- The check should run in editors, local shells, and CI.
- The workflow belongs in the repository rather than Claude settings.

Many teams use both:

- Claude Code hook for destructive-command guardrails.
- Repo-native pre-commit hook for formatting, type checks, or focused tests.

## Repo-wide pre-commit baseline

When the user asks for "pre-commit hooks," prefer a repo-native hook over a
Claude-only hook.

Recommended baseline:

- Format staged files.
- Run the fastest high-signal checks such as typecheck or lint.
- Add tests only when they are fast enough to keep commit latency reasonable.

If the repo is JavaScript or TypeScript heavy, a common setup is:

1. Install a hook runner such as Husky, Lefthook, or simple `core.hooksPath`.
2. Run `lint-staged` or an equivalent staged-files formatter.
3. Run `npm run typecheck` only if the repo already has a stable script.
4. Run a focused test command when the project exposes one.

Keep the default small. A pre-commit hook that takes too long gets bypassed.

## Dangerous git guardrail

When the user wants Claude blocked from destructive git operations, use the
bundled guardrail scripts in this skill:

- `scripts/block-dangerous-git.sh` for Bash environments
- `scripts/block-dangerous-git.ps1` for PowerShell environments

Copy the chosen script into either:

- Project scope: `.claude/hooks/block-dangerous-git.sh` or `.ps1`
- User scope: `~/.claude/hooks/block-dangerous-git.sh` or `.ps1`

Then wire it into `PreToolUse`.

### Bash configuration

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

### PowerShell configuration

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

The PowerShell example still uses the `Bash` matcher because Claude surfaces
shell invocations through the Bash tool. The script itself runs under
PowerShell.

### What the guardrail blocks

The bundled scripts block:

- `git push`
- `git reset --hard`
- `git clean -f` and `git clean -fd`
- `git branch -D`
- `git checkout .`
- `git restore .`

Adjust the patterns only if the user explicitly wants a different policy.

## Verification

Verify the guardrail with a representative payload before you rely on it.

### Bash script

```bash
printf '%s' '{"tool_input":{"command":"git push origin main"}}' \
  | ./.claude/hooks/block-dangerous-git.sh
```

### PowerShell script

```powershell
'{"tool_input":{"command":"git push origin main"}}' |
  pwsh -NoProfile -File ./.claude/hooks/block-dangerous-git.ps1
```

Both commands should exit with code `2` and print a blocking message to
standard error.
