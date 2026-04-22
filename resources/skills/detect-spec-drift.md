---
name: detect-spec-drift
description: "Compares recent code changes against the active canopy task specification to identify misalignment between implementation and proposal."
origin: "Basidiocarp Canopy Drift Detection Pipeline"
---

# Detect Spec Drift Skill

Use this skill to verify that recent code changes align with the specification defined in the active canopy task's council proposal messages.

## When to Activate

- At the start of implementation, to establish baseline alignment
- At regular intervals during implementation (every 5-10 commits)
- Before submitting a task or requesting handoff
- When implementation velocity seems misaligned with proposal scope
- When unexpected file changes appear in recent commits

## How It Works

The skill performs a three-step comparison between the active task specification and recent implementation:

### Step 1: Read Active Task Specification

Retrieve the council proposal messages that define the task scope:

```bash
canopy task view --task-id <active-task-id>
```

Extract the proposal text. The proposal contains:
- **Task title**: the named objective
- **Scope**: what is included and what is explicitly out of scope
- **Acceptance criteria**: the definition of done
- **Constraints**: limitations on approach, tooling, or scope

Store these as the *expected spec*.

### Step 2: List Recently Changed Files

Identify all files modified in the recent implementation window (last 10 commits or past 6 hours):

```bash
git diff --name-only HEAD~10..HEAD
```

Alternatively, use rhizome if available:

```bash
rhizome get-changed-files --since-commits 10
```

Group the files by area (e.g., "src/auth", "tests/", "docs/"). This becomes the *changed scope*.

### Step 3: Compare Specification Against Changes

Ask the model to assess alignment:

1. **Check coverage**: Do the changed files cover the areas mentioned in the proposal? Are all required files present?

2. **Check bounds**: Are there changes outside the proposal scope? Flag any files changed that were not mentioned in the task.

3. **Check depth**: Do the changes match the granularity implied by the proposal? (E.g., if the proposal says "refactor auth module", but only one file changed, that may signal incomplete implementation.)

4. **Check omissions**: Are there areas the proposal mentions that show no changes? Flag gaps.

## Output Format

Emit a structured drift assessment:

```
Spec Drift Check for task #<task-id>:
  Proposal: "<task title>"
  Scope excerpt: "<key constraint or requirement from proposal>"
  Files changed: <count>
    <file1>
    <file2>
    ...
  Assessment: DRIFT DETECTED — <specific reason> | NO DRIFT
  Confidence: low | medium | high
  Details:
    - <finding 1>
    - <finding 2>
```

### Drift Detection Examples

**DRIFT DETECTED — scope creep:**
```
  Changed files include src/payment/*, but proposal makes no mention of payment module.
  Hypothesis: implementation expanded beyond stated scope.
  Confidence: high
```

**DRIFT DETECTED — incomplete implementation:**
```
  Proposal specifies refactor of auth, validation, and logging.
  Changed files: only src/auth/*
  Missing areas: validation (no changes in src/validation/), logging (no changes in src/log/)
  Hypothesis: implementation incomplete or stalled.
  Confidence: medium
```

**NO DRIFT:**
```
  Proposal: add structured logging to CLI entrypoint (src/main.rs, src/cli/)
  Changed files: src/main.rs, src/cli/parse.rs, src/cli/output.rs
  All files are within proposal scope. Changes map cleanly to requirements.
  Confidence: high
```

## Operating Contract

**Assess spec alignment regularly, not just at the end.**

- Run this skill at task start (establish baseline)
- Run again after the first 3-5 commits (verify early alignment)
- Run before handoff or task completion (final check)
- Report drift as soon as detected; do not wait for the end

**When drift is detected:**

1. Emit the assessment immediately
2. Diagnose whether the drift is:
   - **Intentional refinement** (proposal was clarified in-flight, new understanding emerged) → update the proposal to match and document the change
   - **Scope creep** (changes outside proposal scope) → either revert the extra work or submit the expanded scope as a new task
   - **Incomplete work** (changes missing expected areas) → continue implementation to fill gaps
3. Surface the drift to the human or orchestrating agent; do not hide misalignment

## Related Skills and Topics

- **detect-context-drift**: checks whether the agent's working context (recent tool calls, files touched) aligns with the assigned task
- **strategic-compact**: helps preserve context for long-running tasks when drift detection requires understanding accumulated state

## Handoff Pointers

- **Canopy task lifecycle**: canopy owns task creation, proposal messages, and completion signal. Drift detection reads proposal state but does not modify tasks.
- **Cortina lifecycle signals**: consider emitting a structured signal with drift assessment results for later analysis or review.
