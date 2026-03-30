# name-crate-no-rs

> Don't suffix crate names with `-rs` or `-rust`

Crate names should describe the library, not the language.

## Prefer

- short domain-oriented crate names
- names that remain useful outside one ecosystem label
- language qualifiers only when a cross-language family truly requires them

## Avoid

- `-rs` or `-rust` suffixes as a default naming habit
- names that signal implementation language instead of purpose

## See Also

- [proj-workspace-large](./proj-workspace-large.md) - Crate boundaries should stay meaningful
- [lint-cargo-metadata](./lint-cargo-metadata.md) - Package identity is part of the surface
