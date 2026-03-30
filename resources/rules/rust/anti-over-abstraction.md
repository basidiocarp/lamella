# anti-over-abstraction

> Don't over-abstract with excessive generics

Do not add abstraction layers before repetition and boundary pressure are real.

## Prefer

- concrete types and simple functions until a reusable pattern emerges
- generics or traits when they solve a real boundary or duplication problem
- local clarity over theoretical reuse

## Avoid

- trait-heavy designs built only for hypothetical future reuse
- generic signatures that make diagnostics and call sites worse
- abstraction layers that hide simple control flow

## See Also

- [type-generic-bounds](./type-generic-bounds.md) - Keep generic constraints narrow
- [proj-flat-small](./proj-flat-small.md) - Keep small projects simple
