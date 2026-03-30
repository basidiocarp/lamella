# own-move-large

> Move large types instead of copying; use `Box` if moves are expensive

Be intentional about the cost of moving large values repeatedly.

## Prefer

- borrowing large values when ownership transfer is not needed
- boxing large payloads when repeated moves or enum layout make value semantics costly
- measuring before redesigning ownership purely for move cost

## Avoid

- repeated cloning of large values
- boxing large types by default when locality and simplicity matter more
- premature move-cost optimization outside real hotspots

## See Also

- [mem-box-large-variant](./mem-box-large-variant.md) - Box rare large enum variants
- [own-borrow-over-clone](./own-borrow-over-clone.md) - Borrow before duplicating large values
