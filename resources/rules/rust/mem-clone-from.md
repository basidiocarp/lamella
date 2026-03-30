# mem-clone-from

> Use `clone_from()` to reuse allocations when repeatedly cloning

Use `clone_from` when an owned destination already exists and repeated cloning
would otherwise reallocate.

## Prefer

- `clone_from` for `String`, `Vec`, and similar owned buffers updated in place
- reusing existing allocations in loops or refresh paths
- ordinary `clone` when there is no reusable destination

## Avoid

- reaching for `clone_from` when ownership can be borrowed instead
- rewriting code around `clone_from` without a measured allocation benefit
- assuming every type implements a useful optimized `clone_from`

## See Also

- [own-borrow-over-clone](./own-borrow-over-clone.md) - Borrow before cloning
- [mem-reuse-collections](./mem-reuse-collections.md) - Reuse collection allocation directly
