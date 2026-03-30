# api-serde-optional

> Make serde a feature flag, not a hard dependency for library crates

Treat `serde` support in libraries as opt-in unless serialization is the crate's
core purpose.

## Prefer

- a `serde` feature for derive support in general-purpose libraries
- public types that stay useful without serialization enabled
- keeping the feature surface and docs explicit

## Avoid

- forcing every downstream user to pay for serde when many will never serialize the type
- making serialization macros part of the library's mandatory public contract by accident
- optionalizing serde in apps where it is unquestionably core infrastructure

## See Also

- [api-common-traits](./api-common-traits.md) - Derive only the traits that fit the type
- [proj-workspace-deps](./proj-workspace-deps.md) - Keep workspace dependency policy consistent
