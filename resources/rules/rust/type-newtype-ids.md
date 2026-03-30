# type-newtype-ids

> Wrap IDs in newtypes: `UserId(u64)`

Use id newtypes when mixing raw integers would create valid-looking bugs.

## Prefer

- separate types for different ids even if they share a primitive representation
- lightweight wrappers with explicit constructors or conversions
- deriving only the traits ids actually need

## Avoid

- raw integer ids flowing across many APIs
- interchangeable ids distinguished only by parameter order
- overloading one “generic id” type for unrelated domains

## See Also

- [api-newtype-safety](./api-newtype-safety.md) - Use newtypes for semantic separation
- [type-repr-transparent](./type-repr-transparent.md) - Preserve layout when ABI matters
