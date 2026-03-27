# Phase 4: Evaluation (Judge Full Solutions)

Launch **3 independent judges in parallel**.

1. Each judge receives all full solution files.
2. Judges evaluate against final criteria:
   - correctness
   - completeness
   - quality
   - feasibility
3. Each judge produces:
   - comparative analysis
   - evidence-based ratings
   - final vote with rationale
4. Save reports to `.specs/reports/{solution-name}-{date}.[1|2|3].md`.

**Key principle:** Independent judging with evidence reduces bias.

## Prompt Template for Evaluation Judges

```markdown
You are evaluating full candidate solutions for this task.

<task>
{task_description}
</task>

<solutions>
{solution_files}
</solutions>

For each solution:
1. Score correctness, completeness, quality, and feasibility.
2. Cite concrete evidence from the solution text.
3. Explain where each solution is strongest and weakest.

Output:
- comparative summary
- score table
- final vote

Checklist:
- Checked for evidence, not just confidence
- Considered verbosity bias
- Structured the report with VOTE and SCORES near the top
```

## Output Naming

**Evaluation files:** `.specs/reports/{solution-name}-{YYYY-MM-DD}.[1|2|3].md`
