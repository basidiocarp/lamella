# api-default-impl

> Implement `Default` for types with sensible default values

Implement `Default` only when one choice is clearly the expected baseline.

## Prefer

- `Default` for config, builders, and value types with obvious safe starting state
- defaults that stay stable and unsurprising across versions
- `new()` delegating to `default()` when they mean the same thing

## Avoid

- `Default` when callers must choose required values
- defaults that are surprising, lossy, or environment-dependent
- multiple competing notions of “default”

## See Also

- [api-builder-pattern](./api-builder-pattern.md) - Prefer builders when setup is complex
- [api-non-exhaustive](./api-non-exhaustive.md) - Preserve room for future fields
