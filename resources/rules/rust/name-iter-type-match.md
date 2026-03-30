# name-iter-type-match

> Name iterator types after their source method

Iterator type names should match the method that produces them.

## Prefer

- `FooIter`, `FooIterMut`, or equivalent names aligned with the public method
- consistency between method names and returned iterator structs
- standard library conventions where they fit

## Avoid

- iterator type names that force callers to guess which method they relate to
- bespoke naming schemes for ordinary iteration patterns

## See Also

- [name-iter-convention](./name-iter-convention.md) - Keep ownership semantics clear
