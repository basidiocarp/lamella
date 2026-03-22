# Do-and-Judge Workflow

Execute a task with sub-agent implementation and LLM-as-a-judge verification with automatic retry loop.

## Trigger

Use when:
- Executing tasks that require quality verification
- Work that needs external validation (beyond self-critique)
- Automated implementation with quality gates

## Overview

This workflow implements a **single-task execution pattern** with **LLM-as-a-judge verification**. The orchestrator dispatches a focused sub-agent to implement the task, then dispatches an independent judge to verify quality. If verification fails, iterate with judge feedback until passing (score ≥4) or max retries (2) exceeded.

## Key Benefits

- **Fresh context** - Implementation agent works with clean context window
- **External verification** - Judge catches blind spots self-critique misses
- **Feedback loop** - Retry with specific issues identified by judge
- **Quality gate** - Work doesn't ship until it meets threshold

## RED FLAGS - Never Do These

**NEVER:**
- Perform the task yourself (let sub-agents do this)
- Write code or make changes directly
- Skip judge verification to "save time"
- Proceed after max retries without user decision

**ALWAYS:**
- Use Task tool to dispatch sub-agents for ALL implementation work
- Use Task tool to dispatch independent judges for verification
- Wait for implementation to complete before dispatching judge
- Parse only VERDICT/SCORE/ISSUES from judge output

## Workflow Phases

### Phase 1: Task Analysis and Model Selection

Analyze complexity, risk, and scope:

| Model | When to Use |
|-------|-------------|
| `opus` | **Default**. Correctness matters, decisions are nuanced |
| `sonnet` | High volume, repetitive work with clear patterns |
| `haiku` | Trivial operations only (file moves, simple edits) |

### Phase 2: Dispatch Implementation Agent

Construct prompt with:
1. **Zero-shot Chain-of-Thought prefix** - "Let's approach this step by step..."
2. **Task body** - Requirements and constraints
3. **Self-Critique suffix** - Verification questions before submission

### Phase 3: Dispatch Judge Agent

Judge evaluates:
- **Correctness** (35%) - Does implementation meet requirements?
- **Quality** (25%) - Is code well-structured and maintainable?
- **Completeness** (25%) - Are all required elements present?
- **Patterns** (15%) - Does it follow codebase conventions?

### Phase 4: Parse Verdict and Iterate

```
VERDICT: PASS or FAIL
SCORE: X.X/5.0
ISSUES: List of problems

If score ≥4: → PASS → Report success
If score <4: → FAIL → Check retries
  If retries < 2: → Retry with feedback
  If retries ≥ 2: → Escalate to user
```

### Phase 5: Retry with Feedback (If Needed)

Pass judge feedback to implementation agent:
- Focus on fixing specific issues identified
- Do not rewrite everything

### Phase 6: Final Report

```markdown
## Execution Summary

**Task:** {description}
**Result:** ✅ PASS

### Verification
| Attempt | Score | Status |
|---------|-------|--------|
| 1 | X.X/5.0 | PASS/FAIL |

### Files Modified
- file1: what changed
- file2: what changed

### Suggested Improvements (Optional)
{from judge}
```

## Agent Chain

```
┌─────────────────────────────────────────────────┐
│  1. Task Analysis                               │
│     - Assess complexity, risk, scope            │
│     - Select optimal model                      │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  2. Implementation Agent                        │
│     - CoT reasoning                             │
│     - Execute task                              │
│     - Self-critique                             │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  3. Judge Agent                                 │
│     - Evaluate against criteria                 │
│     - Score and verdict                         │
│     - Identify issues                           │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  4. Decision                                    │
│     If PASS: Report success                     │
│     If FAIL + retries < 2: Retry with feedback  │
│     If FAIL + retries ≥ 2: Escalate             │
└─────────────────────────────────────────────────┘
```

## Error Handling

When task fails verification twice:

1. **STOP** - Do not proceed
2. **Report** - Provide failure analysis
3. **Escalate** - Present options to user:
   - Provide additional context for retry
   - Modify task requirements
   - Abort task
4. **Wait** - Do NOT proceed without user decision

## Judge Scoring Scale

| Score | Meaning | Evidence Required |
|-------|---------|-------------------|
| 1 | Unacceptable | Clear failures, missing requirements |
| 2 | Below Average | Multiple issues, partially meets requirements |
| 3 | Adequate | Meets basic requirements, minor issues |
| 4 | Good | Meets ALL requirements, very few minor issues |
| 5 | Excellent | Exceeds requirements (**<5% of evaluations**) |

## Best Practices

### Model Selection
- When in doubt, use Opus - Quality matters more than cost
- Match complexity - Don't use Opus for simple transformations

### Judge Verification
- Never skip - The judge catches what self-critique misses
- Parse only headers - Don't read full reports to avoid context pollution
- Trust the threshold - 4/5.0 is the quality gate

### Iteration
- Focus fixes - Don't rewrite everything, fix specific issues
- Pass feedback verbatim - Let implementation agent see exact issues
- Escalate appropriately - Don't loop forever on fundamental problems
