# anti-type-erasure

> Don't use Box<dyn Trait> when impl Trait works

Do not erase types unless dynamic dispatch or heterogeneity is part of the
design.

## Prefer

- concrete types or generics when one static type flows through the API
- trait objects only when runtime polymorphism is the real requirement
- explicit dyn boundaries where allocation and dispatch cost are intentional

## Avoid

- `Box<dyn Trait>` as a default abstraction tool
- type erasure that hides ownership, error, or lifetime information
- generic APIs so broad they become harder than a trait object where dynamic dispatch is actually needed

## See Also

- [anti-over-abstraction](./anti-over-abstraction.md) - Avoid premature abstraction
- [api-sealed-trait](./api-sealed-trait.md) - Keep trait contracts intentional
