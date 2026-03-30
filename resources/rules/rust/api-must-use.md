# api-must-use

> Mark types and functions with `#[must_use]` when ignoring results is likely a bug

Use `#[must_use]` when silently discarding a value usually means the caller made
a mistake.

## Prefer

- `#[must_use]` on result-like types, builder types, and lazy combinators
- messages that explain the lost effect or missing next step
- leaving obviously ignorable helpers unannotated

## Avoid

- blanket `#[must_use]` on everything
- annotations that create warning fatigue for normal usage
- relying on `#[must_use]` instead of designing clearer APIs

## See Also

- [api-builder-must-use](./api-builder-must-use.md) - Mark fluent builders
- [api-builder-pattern](./api-builder-pattern.md) - Complex construction often needs must-use builders
