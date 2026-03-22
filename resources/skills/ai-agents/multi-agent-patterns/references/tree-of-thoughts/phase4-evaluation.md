# Phase 4: Evaluation (Judge Full Solutions)

Launch **3 independent judges in parallel** (recommended: Opus for rigor):

1. Each judge receives **ALL solution files** (solution.a.md, solution.b.md, solution.c.md)
2. Judges evaluate against **final criteria** (task-specific):
   - **Correctness** (weight based on task)
   - **Completeness** (weight based on task)
   - **Quality** (design, maintainability, etc.)
   - **Feasibility** (can this be implemented?)
3. Each judge produces:
   - **Comparative analysis** (which solution excels where)
   - **Evidence-based ratings** (with specific quotes/examples)
   - **Final vote** (which solution they prefer and why)
4. Reports saved to `.specs/reports/{solution-name}-{date}.[1|2|3].md`

**Key principle:** Multiple independent evaluations with explicit evidence reduce bias and catch different quality aspects.

## Prompt Template for Evaluation Judges

```markdown
You are evaluating {number} full solutions to this task:

<task>
{task_description}
</task>
// ... (56 lines trimmed)
- [ ] Checked for known biases (length, verbosity, confidence)
- [ ] Confident in revised evaluation
- [ ] Structured header with VOTE and SCORES at top of report
```

## Output Naming

**Evaluation files:** `.specs/reports/{solution-name}-{YYYY-MM-DD}.[1|2|3].md`
