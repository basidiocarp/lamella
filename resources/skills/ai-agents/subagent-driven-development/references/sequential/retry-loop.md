# Retry Loop

Use this reference when a sequential step fails judgment.

## Loop

1. Parse the judge report.
2. Extract only the blocking issues.
3. Re-dispatch the implementer with those issues plus any affected context.
4. Re-run the judge.
5. Update the task artifact with the new result.

## Guardrails

- Do not restart the whole step without first narrowing the failure.
- Do not pass the full prior transcript if the issue list is enough.
- Stop and escalate if repeated retries show the step contract is wrong rather than the implementation.
