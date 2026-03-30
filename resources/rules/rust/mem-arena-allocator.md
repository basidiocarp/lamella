# mem-arena-allocator

> Use arena allocators for batch allocations

Use an arena when many related allocations share the same lifetime.

## Prefer

- arenas for parse trees, temporary graphs, and batch-built structures
- freeing the whole arena at once when the phase ends
- measuring first when allocation cost is only suspected

## Avoid

- arenas for long-lived heterogeneous ownership
- forcing arena lifetimes through APIs that would be simpler with normal ownership
- using arenas to dodge borrow design without a real batch-lifetime win

## See Also

- [mem-zero-copy](./mem-zero-copy.md) - Reduce allocation when borrowing is enough
- [mem-reuse-collections](./mem-reuse-collections.md) - Reuse buffers across iterations
