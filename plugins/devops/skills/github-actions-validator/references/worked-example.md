# Complete Worked Example: Multi-Error Workflow

This example shows the assistant workflow for fixing multiple GitHub Actions issues.

## Typical Flow

1. run the validator script
2. map each failure to the relevant reference
3. explain the exact fix
4. produce a corrected workflow
5. rerun validation

## Example Problems to Catch

- invalid cron expression
- invalid runner label
- outdated action version
- script injection from untrusted expressions
- broken `needs` dependency

## Mandatory Rerun

```bash
bash "$SKILL_DIR/scripts/validate_workflow.sh" --lint-only workflow.yml
```

Do not close the review without a rerun result.
