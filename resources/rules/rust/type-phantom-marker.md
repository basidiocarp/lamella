# type-phantom-marker

> Use `PhantomData` to express type relationships without runtime cost

Use `PhantomData` when a type parameter affects ownership, variance, or meaning
but has no stored field.

## Prefer

- `PhantomData` for marker-state types, borrowed relationships, and ownership modeling
- the narrowest marker that expresses the intended variance or lifetime
- comments when the chosen phantom form is non-obvious

## Avoid

- fake stored fields like `Option<T>` just to satisfy the compiler
- `PhantomData` when the type parameter is not actually semantically relevant
- complicated marker choices with no documented reason

## See Also

- [api-typestate](./api-typestate.md) - Use marker types for compile-time phases
- [type-repr-transparent](./type-repr-transparent.md) - Preserve layout when wrappers cross ABI boundaries
