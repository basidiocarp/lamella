# Competitive Multi-Agent Prompt Templates

Templates for each phase of the Generate-Critique-Synthesize pattern.

## Phase 1: Generator Prompt Template

```markdown
<task>
{task_description}
</task>

<constraints>
// ... (22 lines trimmed)
7. Revise solution:
   - Fix identified issues
8. Explain what was changed and why
```

## Phase 2: Judge Prompt Template

```markdown
You are evaluating {number} solutions to this task:

<task>
{task_description}
</task>
// ... (54 lines trimmed)
- [ ] Checked for known biases (length, verbosity, confidence)
- [ ] Confident in revised evaluation
- [ ] Structured header with VOTE and SCORES at top of report
```

## Strategy 1: SELECT_AND_POLISH Prompt Template

```markdown
You are polishing the winning solution based on judge feedback.

<task>
{task_description}
</task>
// ... (31 lines trimmed)
   - What was added from other solutions

CRITICAL: Preserve the winning solution's core approach. Make targeted improvements only.
```

## Strategy 2: REDESIGN Prompt Template

```markdown
You are analyzing why all solutions failed to meet quality standards. And implement new solution based on it.

<task>
{task_description}
</task>
// ... (43 lines trimmed)
11. Revise solution:
   - Fix identified issues
12. Explain what was changed and why
```

## Strategy 3: FULL_SYNTHESIS Prompt Template

```markdown
You are synthesizing the best solution from competitive implementations and evaluations.

<task>
{task_description}
</task>
// ... (31 lines trimmed)
   - How you addressed identified weaknesses

CRITICAL: Do not create something entirely new. Synthesize the best from what exists.
```

## Orchestrator Reply Template

```markdown
## Execution Summary

Original Task: {task_description}

Strategy Used: {strategy} ({reason})
// ... (20 lines trimmed)
| Element              | Source           | Rationale   |
|----------------------|------------------|-------------|
| [element]            | Solution [B/A/C] | [rationale] |
```
