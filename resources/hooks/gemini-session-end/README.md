# Gemini CLI Session-End Hook

## Overview

This hook captures session-end events when using Google's Gemini CLI and reports them to Cortina for lifecycle signal capture and session tracking.

The hook is a thin wrapper that delegates event normalization to Cortina, reusing the existing `claude-code` adapter's hook-event dispatcher for compatibility.

## Lifecycle Coverage

- **Stop (SessionEnd)**: captured when the Gemini CLI session ends

Note: This hook captures only the session boundary. Gemini CLI does not expose tool-use, error, or code-change hooks. For richer signal capture, use the Claude Code adapter or route Gemini calls through an orchestration layer (Volva/Hymenium).

## Installation

This hook is included in the core Lamella plugin package. Install via:

```bash
./lamella install core
```

Or explicitly:

```bash
./lamella install gemini-session-end
```

## Behavior

1. **When a Gemini CLI session ends**, Claude Code's Stop hook fires.
2. **The hook reads**: cwd, session_id, transcript_path from the hook envelope.
3. **It calls**: `cortina adapter claude-code hook-event Stop` with the event payload.
4. **Cortina normalizes** the event and writes it to Hyphae for session tracking.
5. **If Cortina is unavailable**, the hook exits cleanly (fail-open policy).

## Configuration

No explicit configuration needed. The hook operates automatically when installed.

To disable this hook, uninstall the `gemini-session-end` plugin or modify your Claude Code `hooks.json` to remove the Stop hook entry.

## Troubleshooting

### Cortina not in PATH

If Cortina is not installed or not in PATH, this hook silently exits 0. Session-end events will not be captured.

**Resolution**: Install Cortina via `stipe install cortina` or add the Cortina binary directory to PATH.

### Hook execution fails

If the hook script exits with an error, check:
- Bash is available and executable
- `jq` is available (required for JSON parsing)
- The hook envelope is valid JSON (Claude Code validates this)

### No events appearing in Hyphae

If events are not appearing in Hyphae after sessions end:
1. Confirm Cortina is running and available: `which cortina`
2. Check Hyphae connectivity: `hyphae session status`
3. Review Cortina logs: `cortina --version` (should succeed)

## Technical Details

### Payload Structure

The hook sends a normalized event envelope to Cortina:

```json
{
  "hook_type": "Stop",
  "cwd": "/path/to/working/directory",
  "session_id": "claude-code-session-abc123",
  "transcript_path": "/path/to/transcript.jsonl"
}
```

Cortina's Claude Code adapter normalizes this into a `SessionStopEvent` and writes structured session metadata to Hyphae.

### Fail-Open Policy

This hook follows a fail-open policy:
- If Cortina is unavailable, the hook exits 0 (success)
- If Cortina fails, the hook exits 0 and does not block session exit
- Errors are not surfaced to the user

This ensures Gemini CLI operations are not blocked by Cortina unavailability.

## Design Rationale

Gemini CLI's hook surface is minimal and does not expose lifecycle hooks for tool use, error capture, or code changes. A thin wrapper that captures only session boundaries is the most maintainable approach. If Gemini's tooling evolves to expose richer hooks, a full adapter can be implemented; for now, this wrapper provides session continuity without adapter complexity.

## See Also

- [Cortina Adapter Evaluation: Codex and Gemini CLIs](../../../cortina/docs/adapter-evaluation-codex.md)
- [Cortina Claude Code Adapter](../../../cortina/src/adapters/claude_code.rs)
