# mem-smallvec

> Use `SmallVec` for usually-small collections

Use `SmallVec` when collections are usually tiny but may occasionally spill to
the heap.

## Prefer

- `SmallVec` for hot-path small collections with a measured allocation pattern
- inline capacity chosen from real distribution, not guesswork
- normal `Vec` when sizes are unpredictable or often large

## Avoid

- `SmallVec` in public APIs unless the type choice is intentional
- large inline capacities that bloat stack or struct size
- replacing `Vec` everywhere without evidence that allocation is the problem

## See Also

- [mem-arrayvec](./mem-arrayvec.md) - Use fixed-capacity storage when growth is impossible
- [mem-with-capacity](./mem-with-capacity.md) - Keep `Vec` and preallocate when that is enough
