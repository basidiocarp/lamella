# name-consts-screaming

> Use `SCREAMING_SNAKE_CASE` for constants and statics

Follow Rust naming conventions for constants and statics.

## Prefer

- `SCREAMING_SNAKE_CASE` for `const` and `static`
- names that describe the value's role, not just its type
- local consistency with the rest of the crate

## Avoid

- mixed or CamelCase constant names
- generic names like `VALUE` with no domain meaning

## See Also

- [name-funcs-snake](./name-funcs-snake.md) - Use snake_case for functions and modules
- [name-types-camel](./name-types-camel.md) - Use CamelCase for types
