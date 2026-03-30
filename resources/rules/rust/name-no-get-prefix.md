# name-no-get-prefix

> Omit get_ prefix for simple getters

Use the property name directly for cheap accessors.

## Prefer

- `value()`, `name()`, `len()` style getters
- verbs only when work or side effects are involved
- naming that matches the cost and semantics of the method

## Avoid

- `get_` prefixes on ordinary accessors
- bare noun names on expensive or stateful operations

## See Also

- [name-is-has-bool](./name-is-has-bool.md) - Use predicate prefixes for booleans
- [name-funcs-snake](./name-funcs-snake.md) - Keep method names idiomatic
