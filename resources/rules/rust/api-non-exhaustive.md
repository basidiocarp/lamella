# api-non-exhaustive

> Use `#[non_exhaustive]` on public enums and structs for forward compatibility

Use `#[non_exhaustive]` when a public type is likely to grow over time.

## Prefer

- `#[non_exhaustive]` on public enums and config-like structs meant to evolve
- documenting the intended extension surface
- constructor or builder APIs when direct struct literals would lock the shape

## Avoid

- `#[non_exhaustive]` on private or obviously closed types
- forcing exhaustive matching today if you know more variants are likely tomorrow
- adding it mechanically where API stability does not matter

## See Also

- [api-default-impl](./api-default-impl.md) - Defaults often pair with evolving config types
- [api-builder-pattern](./api-builder-pattern.md) - Builders preserve room for future fields
