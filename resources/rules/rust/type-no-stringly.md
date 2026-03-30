# type-no-stringly

> Avoid stringly-typed APIs; use enums, newtypes, or validated types

Use real types when a string carries domain meaning beyond free-form text.

## Prefer

- enums for closed option sets
- newtypes for validated ids, keys, paths, and domain strings
- parsing at the boundary so internal APIs work with typed values

## Avoid

- magic string protocols between internal functions
- booleans or strings standing in for richer domain state
- raw `String` parameters where invalid values are common and costly

## See Also

- [api-newtype-safety](./api-newtype-safety.md) - Encode invariants in the type
- [api-parse-dont-validate](./api-parse-dont-validate.md) - Parse once at the boundary
