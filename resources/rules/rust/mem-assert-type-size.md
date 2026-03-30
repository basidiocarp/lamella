# mem-assert-type-size

> Use static assertions to guard against accidental type size growth

Assert type size when layout drift would materially hurt performance or ABI
expectations.

## Prefer

- static size assertions on hot structs, FFI types, or serialized layouts
- documenting why the size matters
- using assertions as regression guards after measurement

## Avoid

- size assertions on ordinary internal types with no performance or layout contract
- brittle size budgets with no explanation
- treating size as the only performance metric that matters

## See Also

- [mem-smaller-integers](./mem-smaller-integers.md) - Reduce footprint intentionally
- [type-repr-transparent](./type-repr-transparent.md) - Preserve layout when ABI matters
