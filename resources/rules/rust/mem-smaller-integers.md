# mem-smaller-integers

> Use appropriately-sized integers to reduce memory footprint

Use smaller integers when range is known and footprint actually matters.

## Prefer

- sizing integer fields to real domain bounds in dense data structures
- documenting non-obvious range assumptions
- defaulting to ergonomic types like `usize` or `u64` when memory pressure is not real

## Avoid

- tiny integer types that force noisy casts with no measurable gain
- sacrificing arithmetic safety or API clarity for speculative savings
- platform-sized assumptions hidden behind undersized fields

## See Also

- [mem-assert-type-size](./mem-assert-type-size.md) - Guard important layout decisions
- [api-newtype-safety](./api-newtype-safety.md) - Enforce numeric invariants at construction
