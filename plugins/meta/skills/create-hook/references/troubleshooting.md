# Hook Troubleshooting

Common issues and solutions when working with hooks.

## Hook not firing

The hook is configured but never executes.

**Solutions:**
1. Run `/hooks` and confirm the hook appears under the correct event
2. Check that the matcher pattern matches exactly (case-sensitive)
3. Verify you're triggering the right event type:
   - `PreToolUse` fires *before* tool execution
   - `PostToolUse` fires *after* tool execution
4. For `PermissionRequest` hooks in non-interactive mode (`-p`), use `PreToolUse` instead

## Hook error in output

Message like "PreToolUse hook error: ..." in the transcript.

**Test your script manually:**
```bash
echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | ./my-hook.sh
echo $?  # Check the exit code
```

PowerShell version:

```powershell
'{"tool_name":"Bash","tool_input":{"command":"ls"}}' |
  pwsh -NoProfile -File ./my-hook.ps1
$LASTEXITCODE
```

**Common causes:**
- "command not found": Use absolute paths or `$CLAUDE_PROJECT_DIR`
- "jq: command not found": Install `jq` or use Python for JSON parsing
- Script not executable: Run `chmod +x ./my-hook.sh`

## `/hooks` shows no hooks configured

You edited a settings file but hooks don't appear in the menu.

**Solutions:**
1. Restart your session or open `/hooks` to reload
2. Verify JSON is valid (no trailing commas or comments)
3. Confirm settings file is in correct location:
   - `.claude/settings.json` for project hooks
   - `~/.claude/settings.json` for global hooks

## Stop hook runs forever

Claude keeps working in an infinite loop instead of stopping.

**Cause:** Stop hook doesn't check if it already triggered a continuation.

**Fix:** Check `stop_hook_active` field and exit early if `true`:

```bash
#!/bin/bash
INPUT=$(cat)
if [ "$(echo "$INPUT" | jq -r '.stop_hook_active')" = "true" ]; then
  exit 0  # Allow Claude to stop
fi
# ... rest of your hook logic
```

## JSON validation failed

Claude Code shows JSON parsing error even though hook outputs valid JSON.

**Cause:** Your shell profile (`~/.zshrc` or `~/.bashrc`) contains unconditional `echo` statements that prepend text to JSON output:

```
Shell ready on arm64
{"decision": "block", "reason": "Not allowed"}
```

**Fix:** Wrap echo statements so they only run in interactive shells:

```bash
# In ~/.zshrc or ~/.bashrc
if [[ $- == *i* ]]; then
  echo "Shell ready"
fi
```

The `$-` variable contains shell flags; `i` means interactive. Hooks run in non-interactive shells.

## Limitations

- Hooks communicate through stdout, stderr, and exit codes only
- Cannot trigger slash commands or tool calls directly
- Default timeout: 10 minutes (configurable via `timeout` field)
- `PostToolUse` hooks cannot undo actions (tool already executed)
- `PermissionRequest` hooks don't fire in non-interactive mode (`-p`)
- `Stop` hooks fire whenever Claude finishes, not only at task completion
- `Stop` hooks don't fire on user interrupts

## Debug techniques

### Enable debug mode
```bash
claude --debug
```

Shows hook execution details including which hooks matched and their exit codes.

### Toggle verbose mode
Press `Ctrl+O` to see hook output in the transcript.

### Test scripts manually
```bash
# Create sample input
cat > /tmp/test-input.json << 'EOF'
{
  "tool_name": "Bash",
  "tool_input": { "command": "npm test" }
}
EOF

# Test your hook
cat /tmp/test-input.json | ./your-hook.sh
echo "Exit code: $?"
```

PowerShell variant:

```powershell
$json = @'
{
  "tool_name": "Bash",
  "tool_input": { "command": "npm test" }
}
'@

$json | pwsh -NoProfile -File ./your-hook.ps1
$LASTEXITCODE
```

### Check for syntax errors
```bash
bash -n ./your-hook.sh  # Check bash syntax
jq empty < hook-output.json  # Validate JSON
```

## See also

- [advanced.md](advanced.md) — Security and debugging details
- [input-output.md](input-output.md) — I/O formats and exit codes
- [examples.md](examples.md) — Working examples to reference
