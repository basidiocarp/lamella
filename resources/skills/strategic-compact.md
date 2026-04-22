---
name: strategic-compact
description: "Provides a decision table for determining when to compact context based on usage percentage, message count, and active file count."
origin: "ECC strategic-compact (adapted)"
---

# Strategic Compact Skill

Provides systematic guidance for when to compact context during long-running agent sessions. Rather than compacting arbitrarily or waiting until context overflow, use this decision table to compact at logical boundaries.

## When to Activate

- At SessionStart, to establish the compaction guidance framework
- Before any explicit compact decision within the session
- When approaching context limits (annulus reports >60% usage)
- At phase transitions (research → planning → implementation)
- When switching between unrelated tasks

## How It Works

The skill provides a three-axis decision table to determine compaction timing:

### Decision Table

| Context Usage % | Message Count | Active Files | Recommendation |
|---|---|---|---|
| >80% | any | any | **Compact Now** — critical threshold reached |
| 60–80% | >50 messages | any | **Compact Soon** — finish current task first |
| 60–80% | ≤50 messages | >10 | **Compact Soon** — file count pressure |
| <60% | any | any | **Wait** — sufficient headroom, continue work |

### Axis Definitions

1. **Context Usage %**: Retrieved from annulus statusline. Check `annulus statusline` to see current session token usage as a percentage of available context.

2. **Message Count**: Count of exchanges (user messages + assistant responses) in the current session. A threshold of 50 messages indicates the session has accumulated substantial history.

3. **Active File Count**: Number of distinct files currently open, read, or referenced in working memory. A threshold of 10 files suggests file-set pressure that may benefit from a clean slate.

### Interpretation

- **Compact Now** (>80% context usage): Do not delay. Compaction is urgent to prevent context overflow. Summarize state, save critical context to files or memory, then issue `/compact` with a summary of the next phase.

- **Compact Soon** (60–80% usage + either >50 messages OR >10 files): Complete the current task or logical unit, then compact. The session still has headroom for finishing in-flight work, but compaction is recommended before starting new work.

- **Wait** (<60% usage): Continue work without compaction. The session has sufficient token budget to proceed. Revisit the table after the next major milestone or phase transition.

## Hook Integration: Cortina PreCompact Event

Cortina fires a `PreCompact` event when context compaction is about to occur. This skill's guidance integrates with that signal as follows:

1. **Before PreCompact fires**: Consult this decision table proactively. If the table says "wait" but you are approaching a natural phase boundary, you may compact early (the boundary is more important than the exact token count).

2. **When PreCompact fires**: The decision table was not consulted for this automatic compaction. Review the decision table to understand whether the timing aligns with a logical boundary:
   - If PreCompact fires while the table says "wait" (<60%), the automatic compaction may be premature. Review what context will be preserved (instructions, files, git state) and what will be lost (intermediate analysis, tool call history).
   - If PreCompact fires while the table says "compact now" (>80%), the event is confirming the urgent need.

3. **After PreCompact**: If compaction occurs, start the next phase with a clear handoff. Summarize in the first message of the new session what the previous phase accomplished and what the next phase will focus on. This helps recover context that survives (instructions, files, task state).

## What Survives Compaction

Understanding what persists helps you compact strategically:

| Survives | Lost |
|----------|------|
| CLAUDE.md instructions and rules | Intermediate reasoning and analysis |
| Task lists (TodoWrite or handoff files) | Detailed file contents you previously read |
| Persistent memory (hyphae) | Multi-turn conversation context |
| Git state (commits, branches) | Tool call history and counts |
| Files on disk | Nuanced preferences stated in conversation |

## Best Practices

1. **Compact after planning** — Once a plan is finalized in a file or TodoWrite, compact to start fresh with a clean context for implementation.

2. **Compact after major milestones** — When moving from research to planning, planning to implementation, or implementation to testing, use compaction as a phase boundary.

3. **Avoid mid-phase compaction** — If the decision table says "wait," do not compact mid-task unless forced by PreCompact firing. Losing file contents and recent context mid-phase is costly.

4. **Write before compacting** — Save important context, decisions, or partial state to files, TodoWrite, or memory before compacting. This ensures nothing critical is lost.

5. **Summarize the next phase** — When compacting, use `/compact Next: [phase summary]` to guide the post-compact session.

6. **Use annulus for metrics** — Check `annulus statusline` to see the actual context usage % field before consulting the decision table. Do not guess usage.

## Handoff Pointers

- **#66 Cortina PreCompact Hook**: The cortina lifecycle event that fires before automatic compaction. When PreCompact fires, consult this skill's decision table to assess whether the timing aligns with a logical boundary.

- **#133 Token Efficiency Skill**: Adjacent concern. While strategic-compact focuses on *when* to compact, token-efficiency focuses on reducing token generation and improving response conciseness to extend session headroom without compaction.

## Related Skills and Topics

- Memory persistence: Use hyphae to preserve context across compactions
- Phase-based task planning: Structure work in clear phases so compaction aligns with phase boundaries
- Token optimization: Reduce token consumption to extend headroom between compactions
