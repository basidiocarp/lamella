# api-builder-pattern

> Use Builder pattern for complex construction

Use a builder when construction has many optional parameters, defaults, or
ordering-sensitive setup.

## Prefer

- builder setters named after the option they control
- builders that own defaults and validation
- `build()` returning `Result` when construction can fail
- `#[must_use]` on the builder and builder methods
- typestate only when required fields or phases are worth compile-time enforcement

## Avoid

- builders for simple two-argument constructors
- positional constructors with many booleans or `Option` arguments
- setter methods that hide business logic instead of just configuring the value
- sprawling builder APIs when a validated constructor is clearer

## Prefer Simpler Options When

- a validated constructor is clearer
- there are few parameters and no defaults
- callers should not partially configure the type

## See Also

- [api-builder-must-use](./api-builder-must-use.md) - Add `#[must_use]` to builders
- [api-typestate](./api-typestate.md) - Compile-time state machines
- [api-impl-into](./api-impl-into.md) - Accept `impl Into` for flexibility
