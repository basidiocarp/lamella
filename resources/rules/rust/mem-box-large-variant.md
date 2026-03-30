# mem-box-large-variant

> Box large enum variants to reduce overall enum size

Box a large variant when one payload makes the whole enum expensive to move or
store.

## Prefer

- boxing rare large variants in otherwise small enums
- measuring enum size and access patterns first
- documenting why the indirection is worth it

## Avoid

- boxing every variant reflexively
- adding heap indirection when the enum is already small enough
- size-focused changes that ignore access frequency and branch cost

## See Also

- [mem-assert-type-size](./mem-assert-type-size.md) - Guard layout after the optimization
- [type-enum-states](./type-enum-states.md) - Use enums when states are genuinely exclusive
