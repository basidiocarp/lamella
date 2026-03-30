# perf-drain-reuse

> Use drain to reuse allocations

Drain containers when you need to move out elements but keep the allocation.

## Prefer

- `drain(..)` when items must move out and the container will be reused
- `clear()` when you only need to drop contents and keep capacity
- simple ownership transfer when reuse is not valuable

## Avoid

- rebuilding a container from scratch when the buffer can stay alive
- `drain` when a plain iteration or `mem::take` is clearer
- reuse patterns that entangle ownership without a measurable win

## See Also

- [mem-reuse-collections](./mem-reuse-collections.md) - Keep allocations alive across iterations
- [perf-extend-batch](./perf-extend-batch.md) - Refill containers efficiently
