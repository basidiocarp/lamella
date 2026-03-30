# doc-safety-section

> Use `# Safety` sections on unsafe public APIs

Unsafe public APIs must document the caller obligations that keep them sound.

## Prefer

- `# Safety` sections that state required invariants clearly
- obligations phrased in caller terms
- keeping the documented contract aligned with the implementation's real assumptions

## Avoid

- undocumented unsafe public functions, traits, or methods
- vague safety notes that only say “must be valid”
- relying on code comments alone for caller-facing unsafe contracts

## See Also

- [lint-unsafe-doc](./lint-unsafe-doc.md) - Document safety at unsafe sites
- [doc-panics-section](./doc-panics-section.md) - Keep panic and safety contracts distinct
