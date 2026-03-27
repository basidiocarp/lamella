# CI/CD Integration

Use this reference to decide where workflow validation belongs in the delivery
pipeline.

## Pre-Commit

Good for:
- fast checks on changed workflow files
- catching typos before CI
- enforcing local hygiene for frequent workflow edits

Keep pre-commit validation lightweight and scoped to staged workflow files.

## CI Workflow Validation

The default pattern is a dedicated workflow-validation job that runs on:
- pull requests touching `.github/workflows/**`
- optional pushes to protected branches

Typical tools:
- `actionlint`
- shell validation for `run:` steps
- any repo-specific policy or security checks

## Local Dry Runs

Use local dry-run tools such as `act` when you need a behavioral check in
addition to static linting. Keep expectations realistic: not every hosted-runner
behavior reproduces locally.

## Done Criteria

Validation is useful only if it answers:
- which files were checked
- which tool produced the finding
- whether the issue was re-run after the fix

Treat workflow validation as a standard CI gate, not an occasional manual audit.
