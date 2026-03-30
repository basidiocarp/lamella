# name-acronym-word

> Treat acronyms as words in identifiers: `HttpServer`, not `HTTPServer`

Match standard Rust casing conventions for acronyms.

## Prefer

- `Http`, `Json`, `Uuid`, `Xml` in CamelCase names
- consistent acronym treatment across the crate
- following the local project if it already has one stable convention

## Avoid

- all-caps acronym segments in type or variant names
- mixing several acronym styles in one API

## See Also

- [name-types-camel](./name-types-camel.md) - Use CamelCase for types
- [name-variants-camel](./name-variants-camel.md) - Keep enum variants consistent
