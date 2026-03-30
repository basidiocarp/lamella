# lint-cargo-metadata

> Keep `Cargo.toml` metadata complete enough for publishing and tooling

Treat crate metadata as part of the product surface.

## Prefer

- meaningful `description`, `license`, `repository`, and category metadata where relevant
- metadata that matches the actual crate purpose
- keeping package metadata current when the crate evolves

## Avoid

- stale or placeholder metadata
- assuming metadata only matters at publish time
- cargo manifests that give tooling or downstream consumers no useful identity

## See Also

- [doc-cargo-metadata](./doc-cargo-metadata.md) - Document metadata-facing behavior clearly
- [lint-missing-docs](./lint-missing-docs.md) - Treat crate presentation as part of quality
