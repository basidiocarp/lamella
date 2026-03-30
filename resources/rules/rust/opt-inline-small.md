# opt-inline-small

> Use `#[inline]` for small hot functions

Use `#[inline]` sparingly for tiny helpers on proven hot paths or public generic
APIs where it materially helps.

## Prefer

- small performance-critical wrappers or generic combinators
- compiler defaults when there is no clear win
- re-checking after refactors that change function size or usage

## Avoid

- annotating helpers just because they are short
- piling inline hints onto cold or rarely called code
- using `#[inline]` as a reflex instead of a measured choice

## See Also

- [opt-inline-always-rare](./opt-inline-always-rare.md) - Reserve `always` for stronger cases
- [perf-profile-first](./perf-profile-first.md) - Measure first
