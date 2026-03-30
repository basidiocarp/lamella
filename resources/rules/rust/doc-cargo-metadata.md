# doc-cargo-metadata

> Keep package metadata and README-facing crate docs aligned

Treat manifest metadata, crate docs, and README claims as one story.

## Prefer

- crate-level docs that match the published package purpose
- keeping examples, package metadata, and README descriptions aligned
- updating crate docs when the product surface changes

## Avoid

- stale crate docs after a rename or scope shift
- README promises that crate docs no longer support
- treating package metadata as separate from user-facing documentation

## See Also

- [lint-cargo-metadata](./lint-cargo-metadata.md) - Keep manifest metadata complete
- [doc-module-inner](./doc-module-inner.md) - Use module docs to orient readers
