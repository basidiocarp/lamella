# lint-deny-correctness

> Deny correctness lints in CI

Correctness lints should block merges unless the repo has a specific exception.

## Prefer

- denying correctness lints at the project or workspace level
- fixing the code before muting the lint
- narrow allow annotations with a reason when an exception is justified

## Avoid

- warning-only correctness policy in mature projects
- blanket lint suppression
- cargo-culting deny rules the repo cannot realistically keep green

## See Also

- [lint-workspace-lints](./lint-workspace-lints.md) - Centralize lint policy
- [lint-pedantic-selective](./lint-pedantic-selective.md) - Be selective with noisier lint groups
