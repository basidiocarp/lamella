# Atmos JSON Schema System

## Schema File Locations

| Schema | Path | Purpose |
|--------|------|---------|
| Website (Public) | `website/static/schemas/atmos/atmos-manifest/1.0/atmos-manifest.json` | IDE integration, SchemaStore |
| Stack Config | `pkg/datafetcher/schema/stacks/stack-config/1.0.json` | Primary for `validate stacks` |
| Atmos Manifest | `pkg/datafetcher/schema/atmos/manifest/1.0.json` | Minimal fallback |
| Global Config | `pkg/datafetcher/schema/config/global/1.0.json` | atmos.yaml validation |
| Vendor Package | `pkg/datafetcher/schema/vendor/package/1.0.json` | vendor.yaml validation |

**Precedence:** CLI flag > env var > atmos.yaml > embedded default

## Schema Layers

Atmos uses JSON Schema (Draft 2020-12) with three layers:

1. **Website manifest schema** -- Published at `website/static/schemas/atmos/atmos-manifest/1.0/atmos-manifest.json`, registered with SchemaStore
2. **Embedded schemas** -- Under `pkg/datafetcher/schema/`, compiled into Atmos binary via Go `embed`
3. **User-provided schema** -- Override via `atmos.yaml` or CLI flags

## IDE Integration

**VS Code:** Enable SchemaStore or add to `.vscode/settings.json`:

```json
{
  "yaml.schemas": {
    "https://atmos.tools/schemas/atmos/atmos-manifest/1.0/atmos-manifest.json": ["stacks/**/*.yaml"]
  }
}
```

**JetBrains:** Auto-downloads from SchemaStore; manual: Settings > JSON Schema Mappings.

## Schema Structure Overview

**Top-level properties:** `import`, `terraform`, `helmfile`, `packer`, `vars`, `hooks`, `env`, `settings`, `locals`, `components`, `overrides`, `workflows`, `dependencies`, `generate`

**Key definitions:**
- `terraform_component_manifest` -- Component config (metadata, vars, backend, hooks)
- `metadata` -- Type, enabled, component, inherits, workspace
- `backend` / `backend_type` -- S3, GCS, Azure, remote, local
- `settings` -- Validation, depends_on, spacelift, atlantis
- `workflows` / `workflow_manifest` -- Workflow definitions

## Updating Schemas

For step-by-step guides on updating schemas when adding Atmos features, see [schema-updates.md](schema-updates.md).

**Schema source locations:**
- Website: `website/static/schemas/atmos/atmos-manifest/1.0/atmos-manifest.json`
- Embedded: `pkg/datafetcher/schema/`
- Embedding code: `pkg/datafetcher/atmos_fetcher.go`

**Documentation:**
- `website/docs/cli/configuration/schemas.mdx`
- `website/docs/cli/commands/validate/validate-stacks.mdx`
