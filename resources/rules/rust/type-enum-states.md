# type-enum-states

> Use enums for mutually exclusive states

Use an enum when one value must be in exactly one of several states.

## Prefer

- enums for closed state sets and tagged unions
- variants that encode the data each state needs
- methods or matches that make state transitions explicit

## Avoid

- parallel booleans or optional fields that encode invalid combinations
- enums when states are open-ended or plugin-defined
- typestate-level complexity when a simple enum is enough

## See Also

- [api-typestate](./api-typestate.md) - Use typestate when compile-time phases matter
- [type-option-nullable](./type-option-nullable.md) - Use `Option` for simple absence
