# anti-format-hot-path

> Don't use format! in hot paths

Avoid fresh formatting allocations in measured hot loops.

## Prefer

- reusable buffers with `write!`
- literals or direct pushes when formatting is unnecessary
- `format!` freely in cold code where clarity matters more

## Avoid

- `format!` on every hot-path iteration
- contorted buffer micro-management outside real hotspots
- assuming every string allocation is worth rewriting

## See Also

- [mem-write-over-format](./mem-write-over-format.md) - Reuse buffers
- [perf-profile-first](./perf-profile-first.md) - Measure first
