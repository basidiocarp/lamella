# doc-intra-links

> Use Rust intra-doc links for related items

Prefer intra-doc links over plain text references in Rust docs.

## Prefer

- links to related types, functions, modules, and trait items
- link text that stays readable in prose
- rustdoc warning enforcement so broken links fail fast

## Avoid

- plain text references when a clickable verified link is possible
- overlinking every repeated term in one paragraph
- stale manual link targets left unchecked

## See Also

- [doc-link-types](./doc-link-types.md) - Link to concrete API items clearly
- [lint-missing-docs](./lint-missing-docs.md) - Treat docs quality as enforceable
