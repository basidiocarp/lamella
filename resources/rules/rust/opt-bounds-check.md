# opt-bounds-check

> Use iterators and patterns that eliminate bounds checks in hot paths

Prefer patterns the compiler can optimize cleanly when indexing dominates a hot
loop.

## Prefer

- iterator-based loops and zipped iteration over manual index arithmetic
- slice splitting or chunking when it clarifies valid ranges
- profiling before rewriting readable code for bounds-check removal

## Avoid

- manual indexing in hot loops when iterators express the same logic
- unsafe indexing unless profiling proves it is necessary and sound
- chasing bounds-check wins in cold code

## See Also

- [perf-iter-over-index](./perf-iter-over-index.md) - Prefer iterators to manual indexing
- [opt-inline-small](./opt-inline-small.md) - Help the optimizer only where it matters
