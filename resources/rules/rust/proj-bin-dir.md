# proj-bin-dir

> Put additional binaries under `src/bin/`

Use `src/bin/` when one crate ships multiple small executables.

## Prefer

- `src/bin/` for related tools that share the same crate dependencies
- keeping shared logic in `lib.rs` and thin binaries in `src/bin/`
- separate crates only when binaries have substantially different dependency or release needs

## Avoid

- stuffing multiple entrypoints into one `main.rs`
- duplicating business logic across binaries
- splitting into extra crates just because there are two commands

## See Also

- [proj-lib-main-split](./proj-lib-main-split.md) - Keep logic in the library, not just the binary
- [proj-flat-small](./proj-flat-small.md) - Keep small projects simple
