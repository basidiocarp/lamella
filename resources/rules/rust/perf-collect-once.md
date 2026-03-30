# perf-collect-once

> Don't collect intermediate iterators

Materialize iterator pipelines only when you actually need an owned collection.

## Prefer

- one final `collect` at the boundary where ownership is required
- lazy iterator composition for filtering, mapping, and chaining work
- direct loops when they are clearer in a hotspot

## Avoid

- collecting just to re-iterate immediately
- intermediate vectors that exist only to bridge combinators
- over-optimizing non-hot pipelines that are already readable

## See Also

- [perf-iter-lazy](./perf-iter-lazy.md) - Keep iterator work lazy
- [perf-collect-into](./perf-collect-into.md) - Reuse a container when collection is required
