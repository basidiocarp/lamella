# Quality Workflows

Workflows for ensuring code quality.

The `core` plugin currently ships `VERIFICATION.md`, `CRITIQUE.md`, and
`DO-AND-JUDGE.md`. `FULL-AUDIT.md` remains a source-side playbook for deeper,
manual audit passes.

## Workflows

| File | Description |
|------|-------------|
| `VERIFICATION.md` | Build, type, lint, test, security, diff checks (pre-commit + pre-deploy) |
| `CRITIQUE.md` | Multi-perspective code review with parallel judges |
| `DO-AND-JUDGE.md` | Implementation + LLM-as-a-judge verification loop |
| `FULL-AUDIT.md` | Comprehensive codebase audit with 9 parallel auditors |

## See Also

- [Audit scripts](../../scripts/audit/)
