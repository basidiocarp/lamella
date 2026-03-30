# name-into-ownership

> Use `into_` prefix for ownership-consuming conversions

Use `into_` when the method consumes `self` to produce a new owned value.

## Prefer

- `into_` for consuming conversions
- names that signal ownership transfer clearly
- `to_` or `as_` when the method does not consume `self`

## Avoid

- `into_` on borrowed or cheap view methods
- conversion prefixes that hide ownership semantics

## See Also

- [name-as-free](./name-as-free.md) - Use `as_` for borrowed conversions
- [name-to-expensive](./name-to-expensive.md) - Use `to_` for non-consuming but expensive conversions
