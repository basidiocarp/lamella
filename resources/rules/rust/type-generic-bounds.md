# type-generic-bounds

> Add trait bounds only where needed, prefer where clauses for readability

Keep generic constraints as narrow and local as possible.

## Prefer

- trait bounds that match the actual operations used
- `where` clauses when bounds are numerous or long
- moving bounds to impl blocks or methods when only those sites need them

## Avoid

- over-constraining type parameters “just in case”
- unreadable inline generic lists when `where` clauses are clearer
- generic APIs when concrete types would be simpler

## See Also

- [api-common-traits](./api-common-traits.md) - Implement only traits that fit semantics
- [anti-over-abstraction](./anti-over-abstraction.md) - Avoid generic complexity without a real benefit
