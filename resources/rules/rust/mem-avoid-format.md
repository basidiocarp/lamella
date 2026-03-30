# mem-avoid-format

> Avoid `format!()` when string literals work

Do not allocate a formatted string when borrowed text or direct writing is
enough.

## Prefer

- string literals and `push_str` when no formatting is needed
- `write!` into an existing buffer for repeated formatting
- `format!` only when you truly need a new owned string

## Avoid

- `format!` for simple concatenation in hot paths
- temporary strings that are immediately borrowed again
- micro-optimizing every `format!` outside measured paths

## See Also

- [mem-write-over-format](./mem-write-over-format.md) - Write into reusable buffers
- [anti-format-hot-path](./anti-format-hot-path.md) - Avoid formatter allocation in hot code
