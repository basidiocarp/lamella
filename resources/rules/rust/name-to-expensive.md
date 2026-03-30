# name-to-expensive

> Use `to_` prefix for expensive conversions that allocate or compute

Use `to_` when a conversion does work but does not consume `self`.

## Prefer

- `to_` for allocating or computed conversions from borrowed receivers
- naming that signals cost and ownership behavior accurately
- `as_` or `into_` when the method is cheap or consuming instead

## Avoid

- `to_` on cheap borrowed views
- conversion prefixes that hide allocation cost

## See Also

- [name-as-free](./name-as-free.md) - Use `as_` for cheap borrowed views
- [name-into-ownership](./name-into-ownership.md) - Use `into_` for consuming conversion
