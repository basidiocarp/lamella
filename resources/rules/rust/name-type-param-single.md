# name-type-param-single

> Use single uppercase letters for type parameters: `T`, `E`, `K`, `V`

Use conventional type parameter names unless semantic names clearly improve the
signature.

## Prefer

- `T`, `E`, `K`, `V`, and similar standard parameter names for ordinary generics
- semantic names only when several parameters play distinct domain roles
- consistency with the surrounding API style

## Avoid

- long verbose generic names that make signatures noisy
- single-letter names when readers cannot tell the parameters apart

## See Also

- [type-generic-bounds](./type-generic-bounds.md) - Keep generic APIs readable
- [anti-over-abstraction](./anti-over-abstraction.md) - Avoid generic complexity without need
