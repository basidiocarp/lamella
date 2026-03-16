---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session or facing 3+ independent issues that can be investigated without shared state or dependencies - dispatches fresh subagent for each task with code review between tasks, enabling fast iteration with quality gates
---

# Subagent-Driven Development


## Contents

- [Supported types of execution](#supported-types-of-execution)
  - [Sequential Execution](#sequential-execution)
  - [Parallel Execution](#parallel-execution)
- [Sequential Execution Process](#sequential-execution-process)
  - [1. Load Plan](#1-load-plan)
  - [2. Execute Task with Subagent](#2-execute-task-with-subagent)
  - [3. Review Subagent's Work](#3-review-subagents-work)
  - [4. Apply Review Feedback](#4-apply-review-feedback)
  - [5. Mark Complete, Next Task](#5-mark-complete-next-task)
  - [6. Final Review](#6-final-review)
  - [7. Complete Development](#7-complete-development)
  - [Example Workflow](#example-workflow)
  - [Red Flags](#red-flags)
- [Parallel Execution Process](#parallel-execution-process)
  - [Step 1: Load and Review Plan](#step-1-load-and-review-plan)
  - [Step 2: Execute Batch](#step-2-execute-batch)
  - [Step 3: Report](#step-3-report)
  - [Step 4: Continue](#step-4-continue)
  - [Step 5: Complete Development](#step-5-complete-development)
  - [When to Stop and Ask for Help](#when-to-stop-and-ask-for-help)
  - [When to Revisit Earlier Steps](#when-to-revisit-earlier-steps)
  - [Remember](#remember)
- [Parallel Investigation Process](#parallel-investigation-process)
  - [1. Identify Independent Domains](#1-identify-independent-domains)
  - [2. Create Focused Agent Tasks](#2-create-focused-agent-tasks)
  - [3. Dispatch in Parallel](#3-dispatch-in-parallel)
  - [4. Review and Integrate](#4-review-and-integrate)
  - [Agent Prompt Structure](#agent-prompt-structure)
  - [Common Mistakes](#common-mistakes)
  - [When NOT to Use](#when-not-to-use)
  - [Real Example from Session](#real-example-from-session)
  - [#Verification](#verification)


Create and execute plan by dispatching fresh subagent per task or issue, with code and output review after each or batch of tasks.

**Core principle:** Fresh subagent per task + review between or after tasks = high quality, fast iteration.

Executing Plans through agents:

- Same session (no context switch)
- Fresh subagent per task (no context pollution)
- Code review after each or batch of task (catch issues early)
- Faster iteration (no human-in-loop between tasks)

## Supported types of execution

### Sequential Execution

When you have a tasks or issues that are related to each other, and they need to be executed in order, investigating or modifying them sequentially is the best way to go.

Dispatch one agent per task or issue. Let it work sequentially. Review the output and code after each task or issue.

**When to use:**

- Tasks are tightly coupled
- Tasks should be executed in order

### Parallel Execution

When you have multiple unrelated tasks or issues (different files, different subsystems, different bugs), investigatin or modifying them sequentially wastes time. Each task or investigation is independent and can happen in parallel.

Dispatch one agent per independent problem domain. Let them work concurrently.

**When to use:**

- Tasks are mostly independent
- Overral review can be done after all tasks are completed

## Sequential Execution Process

### 1. Load Plan

Read plan file, create TodoWrite with all tasks.

### 2. Execute Task with Subagent

For each task:

**Dispatch fresh subagent:**

```
Task tool (general-purpose):
  description: "Implement Task N: [task name]"
  prompt: |
    You are implementing Task N from [plan-file].
// ... (9 lines trimmed)

    Report: What you implemented, what you tested, test results, files changed, any issues
```

**Subagent reports back** with summary of work.

### 3. Review Subagent's Work

**Dispatch code-reviewer subagent:**

```
Task tool (superpowers:code-reviewer):
  Use template at requesting-code-review/code-reviewer.md

  WHAT_WAS_IMPLEMENTED: [from subagent's report]
  PLAN_OR_REQUIREMENTS: Task N from [plan-file]
  BASE_SHA: [commit before task]
  HEAD_SHA: [current commit]
  DESCRIPTION: [task summary]
```

**Code reviewer returns:** Strengths, Issues (Critical/Important/Minor), Assessment

### 4. Apply Review Feedback

**If issues found:**

- Fix Critical issues immediately
- Fix Important issues before next task
- Note Minor issues

**Dispatch follow-up subagent if needed:**

```
"Fix issues from code review: [list issues]"
```

### 5. Mark Complete, Next Task

- Mark task as completed in TodoWrite
- Move to next task
- Repeat steps 2-5

### 6. Final Review

After all tasks complete, dispatch final code-reviewer:

- Reviews entire implementation
- Checks all plan requirements met
- Validates overall architecture

### 7. Complete Development

After final review passes:

- Announce: "I'm using the finishing-a-development-branch skill to complete this work."
- **REQUIRED SUB-SKILL:** Use superpowers:finishing-a-development-branch
- Follow that skill to verify tests, present options, execute choice

### Example Workflow

```
You: I'm using Subagent-Driven Development to execute this plan.

[Load plan, create TodoWrite]

Task 1: Hook installation script
// ... (26 lines trimmed)
Final reviewer: All requirements met, ready to merge

Done!
```

### Red Flags

**Never:**

- Skip code review between tasks
- Proceed with unfixed Critical issues
- Dispatch multiple implementation subagents in parallel (conflicts)
- Implement without reading plan task

**If subagent fails task:**

- Dispatch fix subagent with specific instructions
- Don't try to fix manually (context pollution)

## Parallel Execution Process

Load plan, review critically, execute tasks in batches, report for review between batches.

**Core principle:** Batch execution with checkpoints for architect review.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

### Step 1: Load and Review Plan

1. Read plan file
2. Review critically - identify any questions or concerns about the plan
3. If concerns: Raise them with your human partner before starting
4. If no concerns: Create TodoWrite and proceed

### Step 2: Execute Batch

**Default: First 3 tasks**

For each task:

1. Mark as in_progress
2. Follow each step exactly (plan has bite-sized steps)
3. Run verifications as specified
4. Mark as completed

### Step 3: Report

When batch complete:

- Show what was implemented
- Show verification output
- Say: "Ready for feedback."

### Step 4: Continue

Based on feedback:

- Apply changes if needed
- Execute next batch
- Repeat until complete

### Step 5: Complete Development

After all tasks complete and verified:

- Announce: "I'm using the finishing-a-development-branch skill to complete this work."
- **REQUIRED SUB-SKILL:** Use superpowers:finishing-a-development-branch
- Follow that skill to verify tests, present options, execute choice

### When to Stop and Ask for Help

**STOP executing immediately when:**

- Hit a blocker mid-batch (missing dependency, test fails, instruction unclear)
- Plan has critical gaps preventing starting
- You don't understand an instruction
- Verification fails repeatedly

**Ask for clarification rather than guessing.**

### When to Revisit Earlier Steps

**Return to Review (Step 1) when:**

- Partner updates the plan based on your feedback
- Fundamental approach needs rethinking

**Don't force through blockers** - stop and ask.

### Remember

- Review plan critically first
- Follow plan steps exactly
- Don't skip verifications
- Reference skills when plan says to
- Between batches: just report and wait
- Stop when blocked, don't guess

## Parallel Investigation Process

Special case of parallel execution, when you have multiple unrelated failures that can be investigated without shared state or dependencies.

### 1. Identify Independent Domains

Group failures by what's broken:

- File A tests: Tool approval flow
- File B tests: Batch completion behavior
- File C tests: Abort functionality

Each domain is independent - fixing tool approval doesn't affect abort tests.

### 2. Create Focused Agent Tasks

Each agent gets:

- **Specific scope:** One test file or subsystem
- **Clear goal:** Make these tests pass
- **Constraints:** Don't change other code
- **Expected output:** Summary of what you found and fixed

### 3. Dispatch in Parallel

```typescript
// In Claude Code / AI environment
Task("Fix agent-tool-abort.test.ts failures")
Task("Fix batch-completion-behavior.test.ts failures")
Task("Fix tool-approval-race-conditions.test.ts failures")
// All three run concurrently
```

### 4. Review and Integrate

When agents return:

- Read each summary
- Verify fixes don't conflict
- Run full test suite
- Integrate all changes

### Agent Prompt Structure

Good agent prompts are:

1. **Focused** - One clear problem domain
2. **Self-contained** - All context needed to understand the problem
3. **Specific about output** - What should the agent return?

```markdown
Fix the 3 failing tests in src/agents/agent-tool-abort.test.ts:

1. "should abort tool with partial output capture" - expects 'interrupted at' in message
2. "should handle mixed completed and aborted tools" - fast tool aborted instead of completed
3. "should properly track pendingToolCount" - expects 3 results but gets 0
// ... (10 lines trimmed)
Do NOT just increase timeouts - find the real issue.

Return: Summary of what you found and what you fixed.
```

### Common Mistakes

**❌ Too broad:** "Fix all the tests" - agent gets lost
**✅ Specific:** "Fix agent-tool-abort.test.ts" - focused scope

**❌ No context:** "Fix the race condition" - agent doesn't know where
**✅ Context:** Paste the error messages and test names

**❌ No constraints:** Agent might refactor everything
**✅ Constraints:** "Do NOT change production code" or "Fix tests only"

**❌ Vague output:** "Fix it" - you don't know what changed
**✅ Specific:** "Return summary of root cause and changes"

### When NOT to Use

**Related failures:** Fixing one might fix others - investigate together first
**Need full context:** Understanding requires seeing entire system
**Exploratory debugging:** You don't know what's broken yet
**Shared state:** Agents would interfere (editing same files, using same resources)

### Real Example from Session

**Scenario:** 6 test failures across 3 files after major refactoring

**Failures:**

- agent-tool-abort.test.ts: 3 failures (timing issues)
- batch-completion-behavior.test.ts: 2 failures (tools not executing)
- tool-approval-race-conditions.test.ts: 1 failure (execution count = 0)

**Decision:** Independent domains - abort logic separate from batch completion separate from race conditions

**Dispatch:**

```
Agent 1 → Fix agent-tool-abort.test.ts
Agent 2 → Fix batch-completion-behavior.test.ts
Agent 3 → Fix tool-approval-race-conditions.test.ts
```

**Results:**

- Agent 1: Replaced timeouts with event-based waiting
- Agent 2: Fixed event structure bug (threadId in wrong place)
- Agent 3: Added wait for async tool execution to complete

**Integration:** All fixes independent, no conflicts, full suite green

**Time saved:** 3 problems solved in parallel vs sequentially

### #Verification

After agents return:

1. **Review each summary** - Understand what changed
2. **Check for conflicts** - Did agents edit same code?
3. **Run full suite** - Verify all fixes work together
4. **Spot check** - Agents can make systematic errors

## Step Verification with LLM-as-Judge

For sequential tasks with dependencies, add independent judge verification between steps to catch blind spots that self-critique misses.

### Judge Verification Loop

```
For each step:
  1. Dispatch implementation sub-agent
  2. Collect output summary
  3. Dispatch judge sub-agent (independent context)
  4. Parse verdict: PASS (≥3.5) or FAIL (<3.5)
  5. If FAIL + retries < 2: retry with judge feedback
  6. If FAIL + retries ≥ 2: escalate to user
  7. If PASS: proceed to next step
```

### Judge Verdict Format

```
VERDICT: [PASS/FAIL]
SCORE: [X.X]/5.0
ISSUES: [list or "None"]
IMPROVEMENTS: [list or "None"]
```

### Context Passing Between Steps

- Max 200 words per step summary
- Pass: files modified, key changes, decisions, warnings
- Omit: implementation details, internal logic
- If >500 words total: summarize older steps more aggressively

See [references/sequential/](references/sequential/) for execution protocols, context formats, model selection, and examples.

## Reference Files


| File | Path |
|------|------|
| [Code Quality Reviewer Prompt](references/code-quality-reviewer-prompt.md) | `references/code-quality-reviewer-prompt.md` |
| [Implementer Prompt](references/implementer-prompt.md) | `references/implementer-prompt.md` |
| [Context Formats](references/sequential/context-formats.md) | `references/sequential/context-formats.md` |
| [Error Handling](references/sequential/error-handling.md) | `references/sequential/error-handling.md` |
| [Examples](references/sequential/examples.md) | `references/sequential/examples.md` |
| [Execution Protocols](references/sequential/execution-protocols.md) | `references/sequential/execution-protocols.md` |
| [Model Selection](references/sequential/model-selection.md) | `references/sequential/model-selection.md` |
| [Task Decomposition](references/sequential/task-decomposition.md) | `references/sequential/task-decomposition.md` |
| [Spec Reviewer Prompt](references/spec-reviewer-prompt.md) | `references/spec-reviewer-prompt.md` |
