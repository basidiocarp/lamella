---
name: token-efficiency
description: Reduces unnecessary token generation through conciseness instructions injected at SessionStart
origin: "caveman compression persona (adapted)"
convention: v1
---

# Token Efficiency

Reduce per-response token expenditure by eliminating verbose scaffolding while preserving code quality and task completion.

## When to Activate

Activate at SessionStart for all sessions unless explicitly disabled per-session.

**Disable for:**
- Onboarding sessions requiring detailed explanation
- Educational content where pedagogical clarity outweighs token cost
- Complex architecture reviews requiring full prose

**Enable for:**
- Implementation work (code writing, refactoring, debugging)
- Mechanical tasks (renames, boilerplate, migrations)
- Iterative design sessions with tight feedback loops
- Artifact generation where token efficiency directly reduces latency

## How It Works

The skill suppresses four categories of verbose scaffolding through SessionStart prompt injection:

### Phase 1: Suppress Preambles and Summaries

Eliminate opening narration ("Let me start by...", "Here's what I'll do...") and closing recap summaries that do not advance the task.

**Keep:** Short contextual framing needed to understand the work ("Reading the file to understand its structure.")

**Cut:** Unnecessary throat-clearing and result reviews that repeat what the output shows.

### Phase 2: Direct Action Over Narration

Prefer imperative action statements over narration of intent.

**Instead of:** "I will now read the file to understand the context"

**Use:** "Reading the file to understand the context."

**Instead of:** "Let me verify this change by running the test suite"

**Use:** "Verifying this change by running the test suite."

### Phase 3: Omit Filler Phrases

Remove generic connectors and hedging that pad responses without adding information.

**Cut phrases:**
- "It looks like..."
- "It seems that..."
- "I should mention that..."
- "As a note..."
- "By the way..."
- "In addition to that..."
- "Essentially..."
- "Basically..."

### Phase 4: Preserve Code and Paths; Cut Surrounding Prose

Keep code blocks, file paths, command invocations, and output intact — these are load-bearing.

Remove the prose scaffolding around them.

**Instead of:**

> Let me check the current state of the file. I'll read it to understand what's there and then we can plan the changes. Looking at the structure, I can see there are several functions here. Let me identify which one needs modification.

**Use:**

> Reading the file to understand the structure.

Then show the read output. Then state the finding directly: "The `validate` function needs modification to add error context."

## SessionStart Hook Integration

This skill is currently distributed through its included hook scripts that suggest compaction at logical intervals during implementation work.

**Planned enhancement:** SessionStart injection via `cortina` that would append a 500-token conciseness instruction block to the base system prompt. This mode is not yet implemented but is reserved for future integration.

**Current operation:**
- Hook scripts in `resources/hooks/` apply local suggestions after edits and writes
- Agents may manually reference the phases above as guidance

**How to use today:**
- The skill is active through its packaged hooks when installed into a Claude plugin or Codex environment
- Per-session: request the skill not be loaded for a specific conversation if conciseness instructions are undesirable
- Per-role: modify manifest configuration to exclude the skill from certain agent roles
- Per-project: update project CLAUDE.md to exclude the skill from the manifest

## Eval Criteria

Three-arm evaluation structure:

### Baseline Arm
No prompt injection. Standard system prompt with no conciseness instruction.

**Metrics:**
- Mean tokens per response (baseline)
- Task completion rate (baseline)

### Terse Control Arm
Generic brevity instruction ("Be concise and direct") without skill-specific content.

**Metrics:**
- Mean tokens per response (control)
- Task completion rate (control)

### Skill Arm
Terse instruction plus token-efficiency skill content (phases 1-4 above).

**Metrics:**
- Mean tokens per response (skill)
- Task completion rate (skill)

### Primary Comparison

**Delta = Skill arm vs. Terse control arm**

- **Token efficiency gain:** (Control tokens - Skill tokens) / Control tokens
- **Task completion delta:** (Skill completion % - Control completion %)
- **Success threshold:** ≥ 15% token reduction while maintaining ≥ 95% task completion parity

Run evaluation using the three-arm harness in #125 (Three-Arm Eval Harness).

## Handoff Pointers

- **#125 Three-Arm Eval Harness** — measurement framework for evaluating baseline, terse control, and skill arms
- **#134 Strategic Compact Skill** — adjacent concern: timing decisions for context compaction (distinct from per-response token efficiency)

## See Also

- **hyphae** — stores learned patterns and resolved errors; support integration for token-efficiency improvements
- **cortina** — hook runner that manages system-prompt injection at SessionStart
- **annulus** — statusline and operator utilities; tracks token usage per session
