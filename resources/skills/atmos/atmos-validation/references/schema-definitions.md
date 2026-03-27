# Schema Definitions

## Common Definition Families

The schema definitions commonly cover:

- `import`
- `components`
- `terraform`, `helmfile`, and `packer`
- component manifests
- `metadata`
- `settings`
- `validation`

Most of these definitions allow either:

- an `!include` style string
- or an object or array carrying the actual configuration

## Pattern Notes

- component maps rely on `patternProperties` for component-name matching
- `settings` is intentionally permissive because users extend it with custom integration data
- metadata definitions are central because they drive inheritance, type, and workspace behavior
