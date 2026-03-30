# name-is-has-bool

> Use `is_`, `has_`, `can_`, `should_` prefixes for boolean-returning methods

Boolean-returning methods should read like predicates.

## Prefer

- `is_`, `has_`, `can_`, or `should_` names that match the semantic question
- positive predicates by default
- consistency across related methods

## Avoid

- noun-like names that hide the boolean nature
- double negatives where a positive predicate would be clearer

## See Also

- [name-funcs-snake](./name-funcs-snake.md) - Keep function naming idiomatic
- [name-no-get-prefix](./name-no-get-prefix.md) - Getter names should stay simple
