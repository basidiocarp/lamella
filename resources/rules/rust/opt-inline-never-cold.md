# opt-inline-never-cold

> Use `#[inline(never)]` and `#[cold]` for error paths and rarely-executed code

Keep rare slow paths from bloating hot code when profiling shows they interfere.

## Prefer

- isolating rare error formatting, diagnostics, or fallback work
- `#[inline(never)]` on bulky cold helpers when code size matters
- pairing with `#[cold]` only when the path is genuinely uncommon

## Avoid

- annotating ordinary helper functions without evidence
- forcing call overhead onto hot code for negligible size benefit
- treating cold attributes as a generic cleanup tool

## See Also

- [opt-cold-unlikely](./opt-cold-unlikely.md) - Mark rare paths intentionally
- [opt-inline-always-rare](./opt-inline-always-rare.md) - Reserve forced inlining for proven hot paths
