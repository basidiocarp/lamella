# Rust API Design Reference

Use these source rule groups when the design question is caller-facing:

- `resources/rules/rust/api-*.md`
- `resources/rules/rust/type-*.md`
- `resources/rules/rust/name-*.md`

Use this skill for:

- builders, `From`/`Into`/`AsRef`, `#[must_use]`
- newtypes, enums, options, results, typestate
- naming conventions for conversions, iterators, booleans, ids, and public types

Keep the rules layer small. Reach for these references only when the API design
question is actually in scope.
