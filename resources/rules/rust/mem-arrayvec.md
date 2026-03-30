# mem-arrayvec

> Use `ArrayVec<T, N>` for fixed-capacity collections that never heap-allocate

Use `ArrayVec` when a collection has a hard small upper bound.

## Prefer

- `ArrayVec` for fixed-capacity buffers and stack-friendly small collections
- capacities chosen from real constraints, not guesswork
- normal `Vec` when growth beyond the bound is legitimate

## Avoid

- `ArrayVec` when overflow behavior is awkward or surprising
- large capacities that bloat stack frames
- swapping in `ArrayVec` before the allocation cost matters

## See Also

- [mem-smallvec](./mem-smallvec.md) - Use inline storage when sizes are usually small, not fixed
- [mem-with-capacity](./mem-with-capacity.md) - Preallocate `Vec` when heap growth is still appropriate
