# api-common-traits

> Implement standard traits (Debug, Clone, PartialEq, etc.) for public types

Implement common traits when they match the type's real semantics.

## Prefer

- `Debug` for public types unless exposure would be actively misleading or unsafe
- `Clone`, `Eq`, `Ord`, or `Hash` when they represent real value semantics
- derives when the default behavior is correct

## Avoid

- deriving traits just because similar types do
- `Copy` or `Clone` on types where duplication is expensive or semantically surprising
- equality or ordering implementations that look structural but encode hidden behavior

## See Also

- [api-default-impl](./api-default-impl.md) - Implement `Default` only when it is meaningful
- [api-newtype-safety](./api-newtype-safety.md) - Use types to encode semantics
