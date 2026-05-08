---
name: agent-introspection-debugging
description: "Activate when an agent is stuck, looping, or hitting context limits — provides self-repair framework and failure-pattern diagnosis."
origin: "ECC agent-introspection-debugging (adapted)"
convention: v1
requires:
  - hyphae
---

# Agent Introspection Debugging

Use this skill when an agent detects it is stuck — looping on the same action, hitting context overflow, rate-limited, or applying stale diffs.

## When to Activate

Activate when any of the following are true:
- The same action has been attempted 3 or more times without progress
- An error pattern is repeating across turns
- Context usage (via `annulus statusline`) exceeds the compact-now threshold
- An unexpected silence or no-op response occurs mid-task
- A patch apply or edit fails citing a line mismatch

## How It Works

Four phases execute in sequence:

1. **Failure Capture**: Record the exact error message, the action that triggered it, and current state (context %, message count, last 3 tool calls). Do not retry before capturing.

2. **Root-Cause Diagnosis**: Classify the failure against the pattern table below. Match to the closest pattern.

3. **Contained Recovery**: Apply the recovery action for the matched pattern. Limit to 2 recovery attempts per pattern before escalating.

4. **Introspection Report**: Emit a structured report (format below) before resuming normal operation. Store in hyphae if the failure was significant.

## Failure Pattern Table

| Pattern | Detection signal | Recovery action |
|---|---|---|
| Loop detection | Same action repeated 3+ times | Break loop, emit Failure Capture, proceed to diagnosis |
| Context overflow | `annulus statusline` context % > 80% | Compact per strategic-compact decision table |
| 429 rate limit | HTTP 429 or "rate limit" in error text | Exponential back-off (2s, 4s, 8s), emit capture |
| Stale diff | Patch apply failure citing line mismatch | Re-read the affected file, regenerate diff from current state |
| Permission denied | FS or API permission error | Check scope, surface to user, do not retry automatically |

## Operating Contract

**Loop invariants**: Every recovery attempt must produce an Introspection Report before resuming. Never retry a failed action more than twice at the same level.

**Crash triage**: If all recovery actions for a matched pattern are exhausted, escalate to the user with the full Introspection Report and stop.

**Timeout policy**: Each recovery phase has a 30-second budget. If exceeded, emit the report and surface to user.

**NEVER STOP**: Continue producing reports and surfacing state even when the failure is unrecoverable — the report itself is the output.

## Introspection Report Format

Emit this block at the end of every recovery attempt:

```markdown
### Introspection Report

- **Failure pattern matched**: [loop detection | context overflow | 429 rate limit | stale diff | permission denied]
- **Detection signal observed**: [exact error or repeated action]
- **Recovery action taken**: [what was done]
- **Outcome**: [recovered | escalated | timed out]
- **Context snapshot**: annulus context % = [X%], message count = [N]
- **Stored in hyphae**: [yes — topic: errors/resolved | no]
```

Store in hyphae (`hyphae memory store --topic errors/resolved`) when the failure was a real error (not a loop), the recovery succeeded, and the pattern is worth remembering for future sessions.

**Requires hyphae 0.11.0 or later** (`hyphae --version` to confirm).

## Handoff Pointers

- **#134 Strategic Compact Skill** — context overflow recovery (Phase 3) uses the strategic-compact decision table
- **#130 Skill Authoring Convention** — canonical format this skill follows
