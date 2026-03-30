# name-as-free

> `as_` prefix: free reference conversion

Use `as_` for cheap borrowed conversions.

## Prefer

- `as_` methods that return borrowed views or reinterpretations without allocation
- names that imply low-cost, non-consuming conversion
- `to_` or `into_` when the conversion allocates or consumes

## Avoid

- `as_` on expensive or owning transformations
- conversion prefixes that hide the cost model

## See Also

- [name-to-expensive](./name-to-expensive.md) - Use `to_` for allocating conversions
- [name-into-ownership](./name-into-ownership.md) - Use `into_` for consuming conversions
