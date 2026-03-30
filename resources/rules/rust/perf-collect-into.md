# perf-collect-into

> Use collect_into for reusing containers

Collect into an existing container when you already own reusable storage.

## Prefer

- collecting into preallocated or reused buffers in hot loops
- ordinary `collect` when there is no reusable destination
- validating that reuse actually matters before complicating the code

## Avoid

- repeated fresh collections when a buffer already exists
- introducing reuse patterns that obscure simple one-shot code
- assuming allocation reuse is always worth the API complexity

## See Also

- [perf-collect-once](./perf-collect-once.md) - Avoid unnecessary intermediate collections
- [mem-reuse-collections](./mem-reuse-collections.md) - Reuse storage directly
