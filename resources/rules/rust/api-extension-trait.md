# api-extension-trait

> Use extension traits to add methods to external types

Use extension traits when you need ergonomic helpers on types you do not own.

## Prefer

- narrowly scoped extension traits with one coherent purpose
- trait names that clearly signal the added capability
- imports that make the extra methods explicit at the call site

## Avoid

- dumping unrelated helpers into one extension trait
- extension traits that shadow or confuse core methods
- using an extension trait when a plain helper function is clearer

## See Also

- [api-sealed-trait](./api-sealed-trait.md) - Control who can implement a trait
- [api-common-traits](./api-common-traits.md) - Prefer standard traits when they fit
