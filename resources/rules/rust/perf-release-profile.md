# perf-release-profile

> Optimize release profile settings

Treat release profile tuning as project policy, not random local tweaks.

## Prefer

- explicit release settings reviewed with the rest of build policy
- measuring runtime, size, and compile-time impact together
- one documented profile strategy per project or workspace

## Avoid

- ad hoc profile flags scattered across crates
- copying “fastest” settings from blog posts without validation
- tuning release profiles before proving the binary needs it

## See Also

- [opt-lto-release](./opt-lto-release.md) - Use LTO intentionally
- [opt-codegen-units](./opt-codegen-units.md) - Tune codegen units with eyes open
