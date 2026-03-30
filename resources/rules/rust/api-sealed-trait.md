# api-sealed-trait

> Use sealed traits to prevent external implementations while allowing use

Seal traits when external impls would make the API harder to evolve safely.

## Prefer

- sealed traits for behavior you want callers to use but not implement
- documenting why the trait is sealed
- open traits only when external implementation is an intentional extension point

## Avoid

- public traits that accidentally become permanent extension contracts
- sealing traits just to work around poor API design
- mixing “open for implementors” and “closed for implementors” semantics in one trait family

## See Also

- [api-extension-trait](./api-extension-trait.md) - Add methods to external types without opening core traits
- [api-non-exhaustive](./api-non-exhaustive.md) - Preserve forward compatibility
