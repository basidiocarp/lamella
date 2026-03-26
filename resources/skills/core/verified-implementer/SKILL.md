---
name: verified-implementer
description: Implements tasks with automated LLM-as-Judge verification for critical steps. Use when work requires automated quality checks, LLM-as-Judge validation, or multi-step verification gates.
metadata:
  argument-hint: "Task file [options] (e.g., \"add-validation.feature.md --continue --human-in-the-loop\")"
---
# Implement Task with Verification

Execute implementation steps with automated quality verification for critical artifacts.

**Your job:** Implement solution using task specification and sub-agents. Do NOT stop until critically necessary or done. Avoid asking questions unless critical. Launch implementation agent, judges, iterate till issues are fixed, then move to next step.

## Contents

- [User Input](#user-input)
- [Command Arguments](#command-arguments)
- [Task Selection](#task-selection)
- [CRITICAL: Orchestrator Role](#critical-orchestrator-role)
- [Overview](#overview)
- [Complete Workflow](#complete-workflow)
- [Phase 1: Load Task](#phase-1-load-task)
- [Phase 2: Execute Steps](#phase-2-execute-steps)
- [Phase 3: Final Verification](#phase-3-final-verification)
- [Phase 4: Move to Done](#phase-4-move-to-done)
- [Phase 5: Report](#phase-5-report)
- [Checklist](#checklist)

**Reference Files:**
- [references/arguments.md](references/arguments.md) - Full argument definitions, refine/continue modes
- [references/phase-0-task-selection.md](references/phase-0-task-selection.md) - Task selection details
- [references/phase-2-execution-patterns.md](references/phase-2-execution-patterns.md) - Patterns A, B, C
- [references/phase-5-aggregation.md](references/phase-5-aggregation.md) - Voting algorithm, report template
- [references/examples.md](references/examples.md) - Usage examples
- [references/error-handling.md](references/error-handling.md) - Error handling
- [references/verification-specs.md](references/verification-specs.md) - Verification specs reference

---

## User Input

```text
$ARGUMENTS
```

---

## Command Arguments

| Argument | Default | Description |
|----------|---------|-------------|
| `task-file` | Auto-detect | Task file path |
| `--continue` | false | Resume from last completed step |
| `--refine` | false | Detect changes, re-verify affected steps |
| `--human-in-the-loop [steps]` | none | Pause for human review |
| `--target-quality X.X[,Y.Y]` | 4.0/4.5 | Quality threshold (standard/critical) |
| `--max-iterations N` | 3 | Max fix→verify cycles |
| `--skip-judges` | false | Skip all verification |

**Full details:** [references/arguments.md](references/arguments.md)

---

## Task Selection

Task status managed by folder:
- `.specs/tasks/todo/` → `.specs/tasks/in-progress/` → `.specs/tasks/done/`

**Full details:** [references/phase-0-task-selection.md](references/phase-0-task-selection.md)

---

## CRITICAL: Orchestrator Role

**Your role is DISPATCH and AGGREGATE. You do NOT do the work.**

### What You DO
- Read the task file ONCE (Phase 1 only)
- Launch sub-agents via Task tool
- Receive reports from sub-agents
- Mark stages complete after judge confirmation
- Aggregate results and report to user

### What You NEVER Do

| Prohibited | Why | Instead |
|------------|-----|---------|
| Read implementation outputs | Context bloat | Use sub-agent report |
| Read reference files | Sub-agent's job | Include path in prompt |
| Read artifacts to "check" | Context bloat | Launch judge agent |
| Evaluate code quality | Not your job | Launch judge agent |
| Skip verification | ALL mandatory | Launch judge anyway |

### Anti-Rationalization Rules

- "I should read this file to understand" → **STOP.** Use sub-agent's report.
- "I'll quickly verify this" → **STOP.** Launch judge agent.
- "This is too simple for verification" → **STOP.** Launch judge anyway.
- "I need to read the reference" → **STOP.** Put path in sub-agent prompt.

**Context window is precious. Protect it. Delegate everything.**

---

## Configuration Rules

- Use `THRESHOLD_FOR_STANDARD_COMPONENTS` (default 4.0) for standard steps
- Use `THRESHOLD_FOR_CRITICAL_COMPONENTS` (default 4.5) for critical steps
- Default 3 iterations max - stop and proceed with warning if exceeded
- If `SKIP_JUDGES`: Skip ALL judge validation
- If `CONTINUE_MODE`: Skip to resume step
- If `REFINE_MODE`: Detect changes, re-verify from earliest affected

### Execution Rules

- **Foreground agents only** - no background agents
- Reject long reports (agent didn't use scratchpad)
- Score 5.0 = hallucination - reject and re-run
- Missing scores = reject and re-run

---

## Overview

This command orchestrates:
1. **Sequential execution** respecting step dependencies
2. **Parallel execution** where dependencies allow
3. **Automated verification** using judge agents
4. **Panel of LLMs (PoLL)** for high-stakes artifacts
5. **Stage tracking** with confirmation after each judge passes

---

## Complete Workflow

```
Phase 0: Select Task & Move to In-Progress
    ▼
Phase 1: Load Task (READ ONCE)
    ▼
// ... (9 lines trimmed)
    ▼
Phase 5: Final Report
```

---

## Phase 1: Load Task

**This is the ONLY phase where you read a file.**

1. Read `$TASK_PATH` ONCE
2. Parse `## Implementation Process` section
3. Identify steps with dependencies and verification needs
4. Create TodoWrite with all steps

### Verification Levels

| Level | When | Config |
|-------|------|--------|
| None | Simple ops | Skip verification |
| Single | Non-critical | 1 judge, 4.0 threshold |
| Panel (2) | Critical | 2 judges, 4.5 threshold |
| Per-Item | Multiple items | 1 judge per item |

---

## Phase 2: Execute Steps

For each step, use the appropriate pattern:

| Pattern | Use For | Details |
|---------|---------|---------|
| **A: Simple** | No verification needed | [Pattern A](references/phase-2-execution-patterns.md#pattern-a-simple-step-no-verification) |
| **B: Critical** | Panel of 2 evaluations | [Pattern B](references/phase-2-execution-patterns.md#pattern-b-critical-step-panel-of-2-evaluations) |
| **C: Multi-Item** | Per-item evaluations | [Pattern C](references/phase-2-execution-patterns.md#pattern-c-multi-item-step-per-item-evaluations) |

### Implementation Agent Prompt Template

```
Implement Step [N]: [Step Title]

Task File: $TASK_PATH
Step Number: [N]

Your task:
- Execute ONLY Step [N]
- Follow Expected Output and Success Criteria exactly

Report: files created/modified, completion confirmation, issues
```

### Judge Agent Prompt Template

```
CLAUDE_PLUGIN_ROOT=${CLAUDE_PLUGIN_ROOT}

Read @${CLAUDE_PLUGIN_ROOT}/prompts/judge.md for methodology.

// ... (6 lines trimmed)

Return: scores with evidence, overall score, PASS/FAIL, improvements if FAIL
```

### Step Completion

On PASS:
- Mark step title with `[DONE]`
- Mark subtasks with `[X]`
- Update todo to `completed`

---

## Phase 3: Final Verification

Launch DoD verification agent:

```
Verify all Definition of Done items in task file.
Task File: $TASK_PATH

For each item:
- Run tests, check build, verify files
- Mark passing items with [X]
- Return: status per item, evidence, issues
```

If any FAIL: Fix via developer agents, re-verify.

---

## Phase 4: Move to Done

```bash
git mv .specs/tasks/in-progress/$TASK_FILENAME .specs/tasks/done/
```

---

## Phase 5: Report

Generate final report with:
- Task status
- Configuration used
- Steps completed with scores
- Verification summary
- DoD results
- Recommendations

**Template:** [references/phase-5-aggregation.md](references/phase-5-aggregation.md#final-report-template)

---

## Checklist

### Context Protection (CRITICAL)
- [ ] Read ONLY the task file - no other files
- [ ] Used sub-agent reports, not file reads
- [ ] Did NOT verify artifacts yourself

### Delegation
- [ ] ALL implementations via `sdd:developer` agents
- [ ] ALL evaluations via judge agents
- [ ] Did NOT skip any verification (unless `SKIP_JUDGES`)

### Stage Tracking
- [ ] Steps marked complete ONLY after judge PASS
- [ ] Task file updated: `[DONE]` on titles, `[X]` on subtasks
- [ ] Todo list updated

### Execution Quality
- [ ] Dependency order respected
- [ ] Parallel steps launched simultaneously
- [ ] Chain-of-thought in evaluation prompts
- [ ] Failed evaluations iterated until threshold or max iterations

### Final Verification
- [ ] DoD verification agent launched
- [ ] All DoD items verified
- [ ] Failing items fixed and re-verified
- [ ] Task moved to `done/` folder

## Quick Verification Mode

For lightweight verification without LLM-as-Judge (e.g., after completing a feature, before a PR):

```
1. Build:     npm run build / pnpm build
2. Types:     npx tsc --noEmit (TS) / pyright . (Python)
3. Lint:      npm run lint / ruff check .
4. Tests:     npm run test -- --coverage (target 80%+)
5. Security:  grep -rn "sk-\|api_key\|console.log" --include="*.ts" src/
6. Diff:      git diff --stat (review for unintended changes)
```

Output: PASS/FAIL per phase, overall READY/NOT READY for PR.
