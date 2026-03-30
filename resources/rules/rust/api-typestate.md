# api-typestate

> Use typestate pattern to encode state machine invariants in the type system

Use typestate when invalid state transitions are a real API hazard and the
extra type surface pays for itself.

## Prefer

- represent meaningful phases as distinct types
- expose methods only on the states where they are valid
- model transitions by consuming `self` and returning the next valid state
- use typestate builders when required fields or phases must exist before `build()`

## Avoid

- adding typestate to simple APIs where a runtime check is clearer
- multiplying marker types for states callers do not care about
- forcing generic-heavy APIs on users when a validated constructor or enum is enough

## Good Fits

- connection or authentication phases
- transactions and protocol handshakes
- builders with required fields
- resources where invalid transitions are common and costly

## Prefer Simpler Alternatives When

- there are only one or two invalid states
- the state machine is a private implementation detail
- the ergonomics cost is larger than the safety gain

## See Also

- [api-builder-pattern](./api-builder-pattern.md) - Basic builder pattern
- [api-parse-dont-validate](./api-parse-dont-validate.md) - Type-driven invariants
- [api-sealed-trait](./api-sealed-trait.md) - Restricting trait implementations
