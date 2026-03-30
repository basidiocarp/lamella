# perf-iter-lazy

> Keep iterators lazy, collect only when needed

Prefer lazy iterator pipelines until an owned container is actually required.

## Prefer

- iterator combinators for one-pass transformations
- materializing only at API boundaries or ownership transitions
- direct loops when they are clearer or easier to optimize in hot code

## Avoid

- collecting purely to continue iterating
- forcing laziness when it makes the code opaque
- treating iterator style as automatically faster than a clear loop

## See Also

- [perf-collect-once](./perf-collect-once.md) - Avoid intermediate collections
- [perf-iter-over-index](./perf-iter-over-index.md) - Prefer iteration to manual indexing
