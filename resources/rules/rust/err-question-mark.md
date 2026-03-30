# err-question-mark

> Use `?` for straightforward error propagation

Use `?` when the right behavior is to return the error upward unchanged except
for optional context.

## Prefer

- `?` in linear fallible flows
- `.context(...)?` when the boundary needs explanation
- explicit handling only where the branch actually changes behavior

## Avoid

- manual `match` boilerplate that only re-returns the error
- hiding important recovery logic behind reflexive `?`
- deeply nested error plumbing when `?` keeps the code linear

## See Also

- [err-context-chain](./err-context-chain.md) - Add context when crossing boundaries
- [err-from-impl](./err-from-impl.md) - Make `?` conversions ergonomic
