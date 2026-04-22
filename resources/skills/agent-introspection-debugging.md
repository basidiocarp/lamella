---
name: agent-introspection-debugging
description: "Detects and recovers from stuck states (loops, context overflow, rate limits, stale diffs, permission errors) using a four-phase self-repair protocol with structured introspection reporting."
origin: "ECC agent-introspection-debugging (adapted)"
metadata:
  author: "basidiocarp"
  version: "1.0"
---

# Agent Introspection Debugging Skill

Use this skill when your agent detects it is stuck — hitting the same error repeatedly, spinning in a loop, running out of context, or encountering rate-limit responses.

## When to Activate

Activate this skill when you observe any of these signals:

- **Same action repeated 3+ times** with no progress
- **Unexpected silence** in task execution with no error message
- **Error pattern repeating** (same failure happening multiple times)
- **Context usage exceeding threshold** (annulus reports context % near or over limit)
- **HTTP 429 (rate limit)** or similar temporary-failure signal
- **Patch apply failure** citing line number mismatches or stale diffs
- **Permission denied** errors on file I/O or API operations

When you detect any of these patterns, pause normal execution and enter the four-phase recovery protocol immediately.

## How It Works

The skill provides a **four-phase self-repair loop**:

### Phase 1: Failure Capture

Record the exact state at the moment you detect being stuck:

- **What action** were you attempting when the failure occurred?
- **What error** did you encounter (exact message)?
- **How many retries** of the same action have you made?
- **Current context state:** what is the annulus context usage percentage?
- **Message count:** how many messages in this session so far?
- **Recent action sequence:** what were the 3-5 actions immediately before the failure?

Do not skip this phase. Accurate capture is critical for diagnosis and for the introspection report you will emit later.

### Phase 2: Root-Cause Diagnosis

Classify the failure against the **failure-pattern classification table** (see below). Match the error, action, or repeated state to one of the five core patterns. Determine which pattern applies.

If the failure matches multiple patterns (e.g., you are in a loop AND context is near threshold), prioritize the **most immediate** blocker:
- Loop detection takes priority over context overflow (break the loop first)
- Rate limits take priority over stale diffs (wait before re-reading)
- Permission errors are non-recoverable (escalate immediately)

### Phase 3: Contained Recovery

Execute the recovery action for the matched pattern. **Do not skip steps** or improvise alternatives. Each recovery action is designed to unblock the specific failure mode.

- **Loop detection:** break the repeating action sequence; emit a capture of what was repeating; wait before resuming a different approach
- **Context overflow:** invoke the Strategic Compact Skill decision table to decide what to compact; compact the specified context; resume after compaction
- **429 rate limit:** apply exponential backoff (1s → 2s → 4s → 8s); emit a capture before waiting; do not retry during the backoff window
- **Stale diff:** re-read the affected file from disk to get the current state; generate a new diff based on the fresh read; apply the regenerated diff
- **Permission denied:** check your scope and permissions; if you are outside your allowed write scope, surface the constraint to the user and do not retry; if scope is unclear, ask the user

### Phase 4: Introspection Report

Emit a structured summary after each recovery attempt, before resuming normal work.

The report must include:

- **Failure pattern matched:** (e.g., "loop detection", "context overflow")
- **Detection signal observed:** the exact error message or repeated action you saw
- **Recovery action taken:** what you did to recover (e.g., "compacted context to 60%", "waited 8s before retry")
- **Outcome:** recovered / escalated / timed out
- **Context snapshot:** annulus context % at failure, current message count
- **Stored in hyphae:** yes/no, and the topic key if stored (e.g., "errors/resolved")

See the **Introspection Report Format** section below for the exact Markdown structure.

## Failure-Pattern Classification Table

This table defines the five core failure patterns. Use it to classify your stuck state in Phase 2.

| Pattern | Detection Signal | Recovery Action |
|---|---|---|
| **Loop detection** | Same action repeated 3+ times with no progress; agent is cycling through the same steps | Break the loop by changing the action or approach; emit a capture with the loop sequence; wait 2-3 seconds before resuming with a different strategy |
| **Context overflow** | annulus reports context % ≥ 80%; session message count exceeds expected headroom; agent reports "context limit" or token budget exhaustion | Invoke the Strategic Compact Skill decision table to identify what to compact (recent history, large file reads, intermediate results); compact the identified content; resume after compaction with reduced context |
| **429 rate limit** | HTTP response 429; error message contains "rate limit", "throttle", or "too many requests" | Apply exponential backoff: wait 1s, then retry; if 429 again, wait 2s; then 4s, 8s, etc. Emit a capture with the retry count before each wait. Do not exceed 5 retry attempts; escalate if 429 persists. |
| **Stale diff** | Patch apply fails with error about line number mismatch, "hunk FAILED", or "Patch does not apply"; file content has changed since diff was generated | Re-read the affected file from disk to get the current state; re-generate the diff based on the fresh read; apply the regenerated diff. If it still fails, check for concurrent modifications and escalate. |
| **Permission denied** | File I/O error: "permission denied", "access denied", "read-only file system"; API error: "401 Unauthorized", "403 Forbidden" | Check whether the target file or API is within your allowed write scope (see handoff metadata or task constraints). If out of scope, surface the constraint to the user and do not retry. If scope is unclear, ask the user. Do not attempt privilege escalation. |

**How to match a pattern:** Find the Detection Signal that most closely matches what you observed. Once matched, follow the Recovery Action exactly. If multiple patterns match, resolve the highest-priority one first (see Phase 2 guidance above).

## Introspection Report Format

Emit this Markdown block after every recovery attempt, before resuming normal work:

```
## Introspection Report

- **Failure pattern matched:** [pattern name from table]
- **Detection signal:** [exact error message or observation]
- **Recovery action taken:** [what you did]
- **Outcome:** [recovered | escalated | timed out]
- **Context snapshot:**
  - Annulus context %: [NN%]
  - Message count: [N]
- **Stored in hyphae:** [yes/no; if yes, topic: `errors/resolved` or `context/{project}`]
- **Next step:** [what you will do when resuming]

---
```

Example introspection report:

```
## Introspection Report

- **Failure pattern matched:** loop detection
- **Detection signal:** Attempted `git push` 4 times; each time received "refusing to update checked-out branch"
- **Recovery action taken:** Broke loop; switched to merging instead of pushing; waited 3 seconds
- **Outcome:** recovered
- **Context snapshot:**
  - Annulus context %: 62%
  - Message count: 47
- **Stored in hyphae:** yes; topic: `errors/resolved`
- **Next step:** Resuming merge-based workflow; will verify result before continuing

---
```

## Operating Contract

**This is an autonomous self-repair skill.** Agents must follow this contract when activated:

### Loop Invariant

You must produce an **Introspection Report** (Phase 4) before resuming normal task work after any recovery attempt. The report is the proof that recovery was intentional and structured, not accidental or reflexive.

### NEVER STOP Declaration

If all recovery actions fail (loop cannot be broken, context cannot be compacted enough, rate limit persists after 5 retries, stale diff still fails after re-read, or permission error is permanent), you must still emit a final Introspection Report with `Outcome: escalated` and then surface the blocker to the user. **Never silently abandon the task.** Escalation is explicit communication, not silence.

### Escalation Path

When a recovery action fails or does not apply:

1. Emit the Introspection Report with `Outcome: escalated`
2. Include the specific blocker: what failed and why
3. Surface a clear statement: "I am blocked on [specific constraint]. User input needed: [what specifically is needed]."
4. Wait for user guidance before resuming

Examples:
- "I am blocked on a rate limit that has persisted through 5 retries. User input needed: clarify if I should wait longer, switch to a different API endpoint, or abandon this step."
- "I am blocked on a permission error. User input needed: confirm I am allowed to write to this file, or indicate a different target location."
- "I am blocked on context overflow. User input needed: which previous results should I discard to free space?"

## Handoff Pointers

- **#130 Skill Authoring Convention:** the canonical skill format rules that this skill follows
- **#134 Strategic Compact Skill:** context overflow recovery in Phase 3 invokes the Strategic Compact Skill decision table to decide what to compact; refer to that skill for the compaction logic
- **Basidiocarp tools:**
  - **annulus:** provides context usage percentage; used in Phase 1 (Failure Capture) and Phase 4 (Introspection Report)
  - **cortina:** lifecycle signal runner; can be used to record introspection reports as structured signals
  - **hyphae:** persistent session memory; introspection reports should be stored with topic `errors/resolved` or `context/{project}` for future recall

## Reference: ECC Agent Introspection Debugging

This skill adapts the ECC `agent-introspection-debugging` skill for basidiocarp. The ECC skill defines the four-phase protocol and the five core failure patterns. This adaptation:

- Replaces generic context-overflow detection with annulus-specific context % checks
- Replaces generic session logging with hyphae topic keys and cortina lifecycle signals
- Adds explicit escalation rules for basidiocarp task constraints and handoff scopes
- Maintains the core four-phase loop and failure-pattern table
