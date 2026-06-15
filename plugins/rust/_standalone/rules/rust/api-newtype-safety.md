# api-newtype-safety

> Use newtypes to prevent mixing semantically different values

Use newtypes when raw primitives would allow valid-looking but wrong calls or
when a value must satisfy an invariant forever after creation.

## Prefer

- distinct newtypes for ids, units, validated values, and domain-specific strings
- constructors or parsers that reject invalid values up front
- lightweight wrappers with focused trait impls
- private inner fields so the invariant cannot be bypassed casually

## Avoid

- raw `String`, `u64`, or `usize` parameters when semantics differ
- newtypes with no semantic benefit
- exposing inner values too freely if that erases the safety gain
- validation methods callers can forget to call

## See Also

- [api-parse-dont-validate](./api-parse-dont-validate.md) - Parse into validated types
- [type-no-stringly](./type-no-stringly.md) - Avoid stringly typed APIs
