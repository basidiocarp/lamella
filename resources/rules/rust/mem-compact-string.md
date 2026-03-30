# mem-compact-string

> Use compact string types for memory-constrained string storage

Reach for compact string crates only when many small strings dominate memory.

## Prefer

- compact string representations for large populations of mostly short strings
- measuring memory savings before adding a dependency
- plain `String` when simplicity matters more than footprint

## Avoid

- replacing `String` everywhere by default
- mixing string types across APIs without a clear boundary
- footprint-driven dependency changes with no evidence of real memory pressure

## See Also

- [mem-smaller-integers](./mem-smaller-integers.md) - Shrink hot data intentionally
- [mem-zero-copy](./mem-zero-copy.md) - Borrow when ownership is unnecessary
