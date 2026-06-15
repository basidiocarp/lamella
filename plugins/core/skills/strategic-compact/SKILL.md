---
name: strategic-compact
description: "Activate at task boundaries when context pressure is high — suggests manual compaction points to preserve context through phases."
origin: "ECC strategic-compact (adapted)"
convention: v1
requires:
  - hyphae
---

# Strategic Compact Skill

Suggests manual `/compact` at strategic points in your workflow rather than relying on arbitrary auto-compaction.

## When to Activate

- Running long sessions that approach context limits (200K+ tokens)
- Working on multi-phase tasks (research → plan → implement → test)
- Switching between unrelated tasks within the same session
- After completing a major milestone and starting new work
- When responses slow down or become less coherent (context pressure)

## Why Strategic Compaction?

Auto-compaction triggers at arbitrary points:
- Often mid-task, losing important context
- No awareness of logical task boundaries
- Can interrupt complex multi-step operations

Strategic compaction at logical boundaries:
- **After exploration, before execution** — Compact research context, keep implementation plan
- **After completing a milestone** — Fresh start for next phase
- **Before major context shifts** — Clear exploration context before different task

## Context Usage Decision Table

| Context usage | Message count | Active files | Recommendation |
|---|---|---|---|
| > 80% | any | any | **Compact now** — critical threshold |
| 60–80% | > 30 messages | any | **Compact soon** — finish current task first |
| 60–80% | ≤ 30 messages | > 10 | **Compact soon** — file count pressure |
| < 60% | any | any | **Wait** — sufficient context headroom |

Check context usage via `annulus statusline` — the context percentage field reflects current session usage.

## How It Works

The `suggest-compact.js` script runs on PreToolUse (Edit/Write) and:

1. **Tracks tool calls** — Counts tool invocations in session
2. **Threshold detection** — Suggests at configurable threshold (default: 50 calls)
3. **Periodic reminders** — Reminds every 25 calls after threshold

## Hook Setup

Add to your `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit",
        "hooks": [{ "type": "command", "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\"" }]
      },
      {
        "matcher": "Write",
        "hooks": [{ "type": "command", "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\"" }]
      }
    ]
  }
}
```

## Configuration

Environment variables:
- `COMPACT_THRESHOLD` — Tool calls before first suggestion (default: 50)

## Compaction Decision Guide

Use this table to decide when to compact:

| Phase Transition | Compact? | Why |
|-----------------|----------|-----|
| Research → Planning | Yes | Research context is bulky; plan is the distilled output |
| Planning → Implementation | Yes | Plan is in TodoWrite or a file; free up context for code |
| Implementation → Testing | Maybe | Keep if tests reference recent code; compact if switching focus |
| Debugging → Next feature | Yes | Debug traces pollute context for unrelated work |
| Mid-implementation | No | Losing variable names, file paths, and partial state is costly |
| After a failed approach | Yes | Clear the dead-end reasoning before trying a new approach |

## PreCompact Hook Integration

Cortina fires a `PreCompact` event before Claude Code compacts context. When this event fires:

1. The decision table above was not consulted — the compact was triggered automatically.
2. If the table would have said "wait" (< 60%), consider whether the compact is premature.
3. Cortina's `pre-compact` adapter captures a snapshot at this boundary — review it afterward via `cortina status`.

The `suggest-compact.js` hook runs on `PreToolUse` and provides earlier warnings before cortina's `PreCompact` fires.

## What Survives Compaction

Understanding what persists helps you compact with confidence:

| Persists | Lost |
|----------|------|
| CLAUDE.md instructions | Intermediate reasoning and analysis |
| TodoWrite task list | File contents you previously read |
| Memory files (`~/.claude/memory/`) | Multi-step conversation context |
| Git state (commits, branches) | Tool call history and counts |
| Files on disk | Nuanced user preferences stated verbally |

## Best Practices

1. **Compact after planning** — Once plan is finalized in TodoWrite, compact to start fresh
2. **Compact after debugging** — Clear error-resolution context before continuing
3. **Don't compact mid-implementation** — Preserve context for related changes
4. **Read the suggestion** — The hook tells you *when*, you decide *if*
5. **Write before compacting** — Save important context to files or memory before compacting
6. **Use `/compact` with a summary** — Add a custom message: `/compact Focus on implementing auth middleware next`

## Related

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) — Token optimization section
- Memory persistence hooks — For state that survives compaction
- `continuous-learning` skill — Extracts patterns before session ends
