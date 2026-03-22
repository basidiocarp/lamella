# Hooks

Hooks are event-driven automations that fire before or after Claude Code tool executions. They enforce code quality, catch mistakes early, and automate repetitive checks.

## How Hooks Work

```
User request → Claude picks a tool → PreToolUse hook runs → Tool executes → PostToolUse hook runs
```

- **PreToolUse** hooks run before the tool executes. They can **block** (exit code 2) or **warn** (stderr without blocking).
- **PostToolUse** hooks run after the tool completes. They can analyze output but cannot block.
- **Stop** hooks run after each Claude response.
- **SessionStart/SessionEnd** hooks run at session lifecycle boundaries.
- **PreCompact** hooks run before context compaction, useful for saving state.

## Hooks in This Plugin

### PreToolUse Hooks

| Hook | Matcher | Behavior | Exit Code |
|------|---------|----------|-----------|
| **Dangerous actions blocker** | `Bash\|Edit\|Write` | Blocks dangerous commands (rm -rf, force push to main) and sensitive file edits (.env, credentials) | 2 (blocks) |
| **Prompt injection detector** | `*` | Detects role overrides, jailbreaks, delimiter injection, base64 payloads | 2 (blocks) |
| **Unicode injection scanner** | `Edit\|Write` | Detects zero-width chars, RTL overrides, ANSI escapes, null bytes in file writes | 2 (blocks) |
| **Dev server blocker** | `Bash` | Blocks `npm run dev` etc. outside tmux — ensures log access | 2 (blocks) |
| **Tmux reminder** | `Bash` | Suggests tmux for long-running commands (npm test, cargo build, docker) | 0 (warns) |
| **Git push reminder** | `Bash` | Reminds to review changes before `git push` | 0 (warns) |
| **Doc file warning** | `Write` | Warns about non-standard `.md`/`.txt` files (allows README, CLAUDE, CONTRIBUTING, CHANGELOG, LICENSE, SKILL, docs/, skills/) | 0 (warns) |
| **Strategic compact** | `Edit\|Write` | Suggests manual `/compact` at logical intervals (every ~50 tool calls) | 0 (warns) |
| **Continuous learning** | `*` | Captures tool use observations asynchronously | 0 (async) |

### PostToolUse Hooks

| Hook | Matcher | What It Does |
|------|---------|-------------|
| **PR logger** | `Bash` | Logs PR URL and review command after `gh pr create` |
| **Build analysis** | `Bash` | Background analysis after build commands (async, non-blocking) |
| **Auto-format** | `Edit` | Auto-formats JS/TS files after edits (auto-detects Biome or Prettier) |
| **TypeScript check** | `Edit` | Runs `tsc --noEmit` after editing `.ts`/`.tsx` files |
| **console.log warning** | `Edit` | Warns about `console.log` statements in edited files |
| **Output validator** | `*` | Flags placeholder paths, TODO content, uncertainty phrases, incomplete implementations |
| **Session logger** | `*` | Logs all tool operations to `~/.claude/logs/activity-YYYY-MM-DD.jsonl` (async) |
| **Continuous learning** | `*` | Captures tool use results asynchronously |

### Lifecycle Hooks

| Hook | Event | What It Does |
|------|-------|-------------|
| **CLAUDE.md scanner** | `SessionStart` | Scans CLAUDE.md files for prompt injection attacks |
| **RTK baseline** | `SessionStart` | Saves RTK token baseline for per-session savings tracking |
| **Session start** | `SessionStart` | Loads previous context and detects package manager |
| **Pre-compact** | `PreCompact` | Saves state before context compaction |
| **Console.log audit** | `Stop` | Checks all modified files for `console.log` after each response |
| **Subagent stop** | `SubagentStop` | Logs subagent completion metrics and cleans up resources (async) |
| **Session end** | `SessionEnd` | Persists session state for next session |
| **Pattern extraction** | `SessionEnd` | Evaluates session for extractable patterns (continuous learning) |
| **Session summary** | `SessionEnd` | Displays session analytics: duration, tool calls, errors, files, git diff, cost, cache stats |

## Available Bash Hooks

The `bash/` directory contains opt-in hooks for manual installation. Add any of these to your `~/.claude/settings.json` or project `.claude/settings.json`.

**Security / Injection Protection**

| Script | Event | Description |
|--------|-------|-------------|
| [dangerous-actions-blocker.sh](./bash/dangerous-actions-blocker.sh) | PreToolUse | Block dangerous commands (rm -rf, fork bombs, force push to main) and sensitive file edits (.env, id_rsa, credentials.json) |
| [security-gate.sh](./bash/security-gate.sh) | PreToolUse | Detect vulnerable code patterns in edited source files (complements dangerous-actions-blocker) |
| [prompt-injection-detector.sh](./bash/prompt-injection-detector.sh) | PreToolUse | Detect prompt injection attempts (role overrides, jailbreaks, delimiter injection, base64 payloads) |
| [unicode-injection-scanner.sh](./bash/unicode-injection-scanner.sh) | PreToolUse | Detect zero-width chars, RTL overrides, ANSI escapes, and null bytes |
| [repo-integrity-scanner.sh](./bash/repo-integrity-scanner.sh) | PreToolUse | Scan README/package.json for hidden injection before reads |
| [mcp-config-integrity.sh](./bash/mcp-config-integrity.sh) | SessionStart | Verify MCP config hash on session start (guards CVE-2025-54135/54136) |
| [claudemd-scanner.sh](./bash/claudemd-scanner.sh) | SessionStart | Scan CLAUDE.md files for prompt injection attacks before Claude processes them |
| [output-secrets-scanner.sh](./bash/output-secrets-scanner.sh) | PostToolUse | Scan tool outputs for leaked secrets (API keys, tokens, private keys, DB URLs) |
| [sandbox-validation.sh](./bash/sandbox-validation.sh) | PreToolUse | Validate sandbox isolation boundaries |
| [pre-commit-secrets.sh](./bash/pre-commit-secrets.sh) | Git hook | Block secrets from entering commits |

**Productivity / Quality**

| Script | Event | Description |
|--------|-------|-------------|
| [typecheck-on-save.sh](./bash/typecheck-on-save.sh) | PostToolUse | Run TypeScript checks on `.ts`/`.tsx` edits |
| [test-on-change.sh](./bash/test-on-change.sh) | PostToolUse | Run tests on file changes |
| [auto-checkpoint.sh](./bash/auto-checkpoint.sh) | PostToolUse | Auto-checkpoint work at configurable intervals |
| [output-validator.sh](./bash/output-validator.sh) | PostToolUse | Heuristic output validation — flags placeholder paths, TODO content, uncertainty phrases, incomplete implementations |
| [file-guard.sh](./bash/file-guard.sh) | PreToolUse | Protect specific files or directories from modification |
| [pre-commit-evaluator.sh](./bash/pre-commit-evaluator.sh) | Git hook | LLM-as-a-Judge pre-commit validation (~$0.01-0.05/commit, opt-in via `CLAUDE_PRECOMMIT_EVAL=1`) |

**Observability / Analytics**

| Script | Event | Description |
|--------|-------|-------------|
| [session-summary.sh](./bash/session-summary.sh) | SessionEnd | Full session analytics: duration, tool calls, errors, files, git diff, cost, cache stats (15 configurable sections) |
| [session-summary-config.sh](./bash/session-summary-config.sh) | CLI tool | Configure session-summary sections, order, and preview output |
| [session-logger.sh](./bash/session-logger.sh) | PostToolUse | Log all operations to `~/.claude/logs/activity-YYYY-MM-DD.jsonl` |
| [rtk-baseline.sh](./bash/rtk-baseline.sh) | SessionStart | Save RTK token baseline for per-session savings tracking |
| [rtk-auto-wrapper.sh](./bash/rtk-auto-wrapper.sh) | PreToolUse | Auto-wrap commands with RTK for token savings |
| [setup-init.sh](./bash/setup-init.sh) | SessionStart | Initialize session environment variables |

**Notifications / Other**

| Script | Event | Description |
|--------|-------|-------------|
| [notification.sh](./bash/notification.sh) | Notification | Contextual macOS sound alerts (Hero for success, Basso for errors, Submarine for waiting) |
| [tts-selective.sh](./bash/tts-selective.sh) | PostToolUse | Text-to-speech for selected outputs |
| [subagent-stop.sh](./bash/subagent-stop.sh) | Stop | Clean up sub-agent resources |

Each script contains configuration instructions in its header comments.

## Customizing Hooks

### Disabling a Hook

Remove or comment out the hook entry in `hooks.json`. If installed as a plugin, override in your `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [],
        "description": "Override: allow all .md file creation"
      }
    ]
  }
}
```

### Writing Your Own Hook

Hooks are shell commands that receive tool input as JSON on stdin and must output JSON on stdout.

**Basic structure:**

```javascript
// my-hook.js
let data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  const input = JSON.parse(data);

  // Access tool info
  const toolName = input.tool_name;        // "Edit", "Bash", "Write", etc.
  const toolInput = input.tool_input;      // Tool-specific parameters
  const toolOutput = input.tool_output;    // Only available in PostToolUse

  // Warn (non-blocking): write to stderr
  console.error('[Hook] Warning message shown to Claude');

  // Block (PreToolUse only): exit with code 2
  // process.exit(2);

  // Always output the original data to stdout
  console.log(data);
});
```

**Exit codes:**
- `0` — Success (continue execution)
- `2` — Block the tool call (PreToolUse only)
- Other non-zero — Error (logged but does not block)

### Hook Input Schema

```typescript
interface HookInput {
  tool_name: string;          // "Bash", "Edit", "Write", "Read", etc.
  tool_input: {
    command?: string;         // Bash: the command being run
    file_path?: string;       // Edit/Write/Read: target file
    old_string?: string;      // Edit: text being replaced
    new_string?: string;      // Edit: replacement text
    content?: string;         // Write: file content
  };
  tool_output?: {             // PostToolUse only
    output?: string;          // Command/tool output
  };
}
```

### Async Hooks

For hooks that should not block the main flow (e.g., background analysis):

```json
{
  "type": "command",
  "command": "node my-slow-hook.js",
  "async": true,
  "timeout": 30
}
```

Async hooks run in the background. They cannot block tool execution.

## Common Hook Recipes

### Warn about TODO comments

```json
{
  "matcher": "Edit",
  "hooks": [{
    "type": "command",
    "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const ns=i.tool_input?.new_string||'';if(/TODO|FIXME|HACK/.test(ns)){console.error('[Hook] New TODO/FIXME added - consider creating an issue')}console.log(d)})\""
  }],
  "description": "Warn when adding TODO/FIXME comments"
}
```

### Block large file creation

```json
{
  "matcher": "Write",
  "hooks": [{
    "type": "command",
    "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const c=i.tool_input?.content||'';const lines=c.split('\\n').length;if(lines>800){console.error('[Hook] BLOCKED: File exceeds 800 lines ('+lines+' lines)');console.error('[Hook] Split into smaller, focused modules');process.exit(2)}console.log(d)})\""
  }],
  "description": "Block creation of files larger than 800 lines"
}
```

### Auto-format Python files with ruff

```json
{
  "matcher": "Edit",
  "hooks": [{
    "type": "command",
    "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path||'';if(/\\.py$/.test(p)){const{execFileSync}=require('child_process');try{execFileSync('ruff',['format',p],{stdio:'pipe'})}catch(e){}}console.log(d)})\""
  }],
  "description": "Auto-format Python files with ruff after edits"
}
```

### Require test files alongside new source files

```json
{
  "matcher": "Write",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path||'';if(/src\\/.*\\.(ts|js)$/.test(p)&&!/\\.test\\.|\\.spec\\./.test(p)){const testPath=p.replace(/\\.(ts|js)$/,'.test.$1');if(!fs.existsSync(testPath)){console.error('[Hook] No test file found for: '+p);console.error('[Hook] Expected: '+testPath);console.error('[Hook] Consider writing tests first (/tdd)')}}console.log(d)})\""
  }],
  "description": "Remind to create tests when adding new source files"
}
```

## Cross-Platform Notes

All hooks in this plugin use Node.js (`node -e` or `node script.js`) for maximum compatibility across Windows, macOS, and Linux. Avoid bash-specific syntax in hooks.

## Related

- [rules/common/hooks.md](../../rules/common/hooks.md) — Hook architecture guidelines
- [skills/core/strategic-compact/](../../skills/core/strategic-compact/) — Strategic compaction skill
- [hooks/compaction/](../compaction/) — Compaction strategy and pre-compact hook
- [scripts/hooks/](../../scripts/hooks/) — Hook script implementations
