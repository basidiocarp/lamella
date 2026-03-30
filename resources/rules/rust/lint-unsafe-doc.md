# lint-unsafe-doc

> Require clear safety documentation around unsafe code

Unsafe code should state the invariants that make it sound.

## Prefer

- `SAFETY:` comments at the unsafe block or impl that explain why the operation is valid
- docs that name the caller obligations for unsafe public APIs
- keeping the unsafe region as small as possible

## Avoid

- unsafe blocks with no invariant explanation
- comments that restate the operation instead of the safety argument
- broad unsafe sections that make soundness review harder

## See Also

- [doc-safety-section](./doc-safety-section.md) - Document caller obligations for unsafe APIs
- [doc-panics-section](./doc-panics-section.md) - Keep safety and panic contracts separate
