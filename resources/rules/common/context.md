---
description: "Context compaction strategy. Compact at logical task boundaries, not arbitrarily."
---

# Context Management

Compact context at logical task boundaries instead of letting auto-compaction trigger mid-task. Manual compaction preserves intent; auto-compaction discards arbitrarily.

## When to Compact

- Approaching context limits during a long session
- Transitioning between task phases (research → planning → implementation)
- Switching to unrelated work within the same session
- After completing a dead-end approach before trying a new one
- After planning is captured in TodoWrite or a file

## When NOT to Compact

- Mid-implementation when file paths, variable names, and partial state are actively needed
- When the session is nearly done and no further work is planned
- When context usage is low and compaction would lose more than it saves

## Phase Transition Guide

| Phase Transition | Compact? | Why |
|-----------------|----------|-----|
| Research → Planning | Yes | Research context is bulky; plan is the distilled output |
| Planning → Implementation | Yes | Plan is in TodoWrite or a file; free up context for code |
| Implementation → Testing | Maybe | Keep if tests reference recent code; compact if switching focus |
| Debugging → Next feature | Yes | Debug traces pollute context for unrelated work |
| Mid-implementation | No | Losing variable names, file paths, and partial state is costly |
| After a failed approach | Yes | Clear the dead-end reasoning before trying a new approach |

## What Survives Compaction

| Persists | Lost |
|----------|------|
| CLAUDE.md instructions | Intermediate reasoning and analysis |
| TodoWrite task list | File contents you previously read |
| Memory files (`~/.claude/memory/`) | Multi-step conversation context |
| Git state (commits, branches) | Tool call history and counts |
| Files on disk | Nuanced user preferences stated verbally |

## What to Preserve

Keep these items verbatim in the compacted summary:

- Active task list (TodoWrite contents or equivalent)
- File paths currently being modified
- Function signatures and variable names referenced in the current task
- Architectural decisions made this session with their rationale
- User preferences expressed during the session
- Blockers and open questions
- Test results and their pass/fail status
- Git state (current branch, uncommitted files, recent commit hashes)

## What to Compress

Reduce these to one-sentence summaries:

- Research findings (keep conclusions, drop exploration steps)
- Debugging traces (keep root cause, drop intermediate hypotheses)
- Discussion about rejected approaches (keep "rejected X because Y")
- File contents that were read for reference (keep the relevant excerpt)

## What to Drop

Remove entirely:

- Tool call history and intermediate outputs
- File contents that were read but not relevant to current work
- Verbose error messages once the fix is identified
- Conversation about process once a decision was made
- Duplicate information already captured in files on disk or TodoWrite

## Compacted Summary Format

Structure the compacted context as:

```
Session focus: [one sentence describing the current objective]

Active tasks:
[numbered list from TodoWrite or equivalent]

Working state:
[files being modified, current branch, uncommitted changes]

Decisions:
[each decision as "chose X over Y because Z"]

Carry forward:
[anything from the preserve list not covered above]

Next action:
[the specific thing to do immediately after compaction]
```

Pass this summary to `/compact` as the compaction prompt.

## Best Practices

1. **Compact after planning** — Once plan is finalized in TodoWrite, compact to start fresh
2. **Compact after debugging** — Clear error-resolution context before continuing
3. **Don't compact mid-implementation** — Preserve context for related changes
4. **Write before compacting** — Save important context to files or memory before compacting
5. **Use `/compact` with a summary** — Add a custom message: `/compact Focus on implementing auth middleware next`
