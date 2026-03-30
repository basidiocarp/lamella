# mem-with-capacity

> Use `with_capacity()` when size is known

Preallocate when you have a credible size estimate.

## Prefer

- `with_capacity` from known input size, batch size, or protocol limits
- overestimates small enough that wasted memory is acceptable
- plain `new` when size is unknown or tiny

## Avoid

- repeated growth of obviously predictable collections
- giant speculative capacities that waste memory
- cargo-cult `with_capacity` on every small vector

## See Also

- [mem-reuse-collections](./mem-reuse-collections.md) - Keep the capacity you already paid for
- [perf-extend-batch](./perf-extend-batch.md) - Combine preallocation with batch insertion
