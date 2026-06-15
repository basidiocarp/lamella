# Validation Tooling and Structure

Before validation starts, confirm the chart has the required files and the
validator has the expected tools.

## Minimum Checks

- `helm`
- YAML linter or fallback syntax checker
- schema validator such as `kubeconform`
- optional cluster access for server-side dry runs

If a tool is missing, continue with the remaining stages and report the gap
explicitly.
