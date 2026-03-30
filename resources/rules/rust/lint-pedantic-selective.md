# lint-pedantic-selective

> Use pedantic lints selectively, not wholesale by default

Pedantic lints are useful, but not all of them belong in every repo.

## Prefer

- enabling the pedantic lints that match the repo's standards and tolerance for noise
- documenting recurring allow decisions in workspace policy
- turning on new pedantic lints gradually

## Avoid

- blanket pedantic deny policies no one will maintain
- treating every pedantic suggestion as universally correct
- suppressing dozens of pedantic lints inline because the top-level policy was too broad

## See Also

- [lint-workspace-lints](./lint-workspace-lints.md) - Centralize lint selection
- [lint-warn-style](./lint-warn-style.md) - Keep style guidance at an appropriate severity
