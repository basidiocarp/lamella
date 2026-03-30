# lint-warn-complexity

> Warn on complexity lints instead of ignoring them

Complexity lints are early signals that a function is getting harder to reason
about.

## Prefer

- warning-level complexity lints that prompt refactoring before code becomes unreviewable
- fixing root causes such as oversized functions or branching tangles
- using severity that matches the repo's tolerance for complexity

## Avoid

- ignoring complexity signals until the code is painful to change
- blanket denial if the repo cannot keep it green
- counting lint score as a goal in itself

## See Also

- [lint-pedantic-selective](./lint-pedantic-selective.md) - Be selective with noisier lints
- [common/debugging.md](../common/debugging.md) - Simpler control flow is easier to debug
