# opt-inline-always-rare

> Use `#[inline(always)]` sparingly—only for critical hot paths proven by profiling

Treat `#[inline(always)]` as an exception, not a default.

## Prefer

- `#[inline(always)]` only after profiling and inspection justify it
- ordinary inlining heuristics or plain `#[inline]` first
- removing forced inlining when it stops helping

## Avoid

- force-inlining every small helper
- assuming smaller source functions should always inline
- using inlining attributes as a substitute for better algorithms or data layout

## See Also

- [opt-inline-small](./opt-inline-small.md) - Use lighter hints for small hot helpers
- [perf-profile-first](./perf-profile-first.md) - Measure before optimizing
