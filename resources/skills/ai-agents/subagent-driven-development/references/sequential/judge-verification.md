# Judge Verification

Use this reference after the implementer finishes a step.

## Judge Goal

Verify whether the step satisfies the original step contract, integrates with prior work, and leaves actionable feedback if it fails.

## Judge Prompt Shape

```markdown
You are verifying completion of Step {N}/{total}: {subtask_name}

<original_task>
{overall_task_description}
</original_task>

<step_requirements>
{step_requirements}
</step_requirements>

<implementation_summary>
{implementer_report}
</implementation_summary>
```

## Verdict Rule

- Pass when the step contract is met and no critical integration issue remains.
- Fail when the score is below threshold or a blocking issue is present.
- On failure, return a concrete issue list rather than broad redesign advice.
