# api-builder-must-use

> Mark builder methods with `#[must_use]` to prevent silent drops

Builders should warn when callers ignore intermediate state.

## Prefer

- `#[must_use]` on the builder type
- `#[must_use]` on consuming builder methods that return updated builders
- messages that explain the likely mistake plainly

## Avoid

- fluent APIs that silently do nothing when the returned builder is dropped
- `#[must_use]` on setters that mutate `&mut self` in place

## See Also

- [api-builder-pattern](./api-builder-pattern.md) - Use builders for complex construction
- [api-must-use](./api-must-use.md) - Mark bug-prone results as must-use
