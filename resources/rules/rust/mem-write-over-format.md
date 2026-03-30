# mem-write-over-format

> Use `write!()` into existing buffers instead of `format!()` allocations

Prefer formatting into reusable buffers when generating many strings.

## Prefer

- `write!` into `String` or `fmt::Write` buffers that already exist
- reusable scratch buffers in loops or emitters
- `format!` when you genuinely need a fresh owned string

## Avoid

- `format!` in tight loops when the result is immediately appended elsewhere
- complex write chains that hurt clarity in cold code
- assuming buffer reuse matters outside measured formatting-heavy paths

## See Also

- [mem-avoid-format](./mem-avoid-format.md) - Skip formatting entirely when literals suffice
- [anti-format-hot-path](./anti-format-hot-path.md) - Avoid hot-path formatter allocation
