# api-parse-dont-validate

> Parse into validated types at boundaries

Parse raw input into validated domain types as early as possible.

## Prefer

- parsing CLI, API, config, and storage input at the boundary
- accepting validated types in internal APIs instead of re-validating strings or integers everywhere
- constructors that make invalid states unrepresentable

## Avoid

- scattered validation checks throughout business logic
- passing raw strings or numbers deep into the system and hoping callers validated them
- lossy “validated” wrappers that still expose unchecked mutation

## See Also

- [api-newtype-safety](./api-newtype-safety.md) - Use types to separate domain values
- [api-typestate](./api-typestate.md) - Encode valid phases in the type system
