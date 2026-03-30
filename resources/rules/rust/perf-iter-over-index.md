# perf-iter-over-index

> Prefer iterators over manual indexing

Use iterators when they express traversal cleanly and avoid needless index
management.

## Prefer

- direct iteration, zips, and enumerations over manual `0..len` loops
- indexing only when the algorithm truly depends on positions
- iterator forms the compiler can optimize well in hot code

## Avoid

- manual indexing with repeated bounds checks and off-by-one risk
- contorting logic into iterators when indexing is actually clearer
- assuming iterator style alone solves performance

## See Also

- [opt-bounds-check](./opt-bounds-check.md) - Help the compiler remove bounds checks
- [perf-iter-lazy](./perf-iter-lazy.md) - Keep pipelines lazy when possible
