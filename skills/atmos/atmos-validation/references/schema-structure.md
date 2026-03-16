# Atmos Manifest Schema Structure Reference

## Schema File Locations

| File | Purpose | Embedding |
|------|---------|-----------|
| `website/static/schemas/atmos/atmos-manifest/1.0/atmos-manifest.json` | Public schema for website and IDE integration | Not embedded; deployed to `atmos.tools` |
|| `pkg/datafetcher/schema/config/global/1.0.json` | Global Atmos config schema | Embedded via `//go:embed schema/*` |

## Top-Level Schema Structure

All manifest schemas follow this structure:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://json.schemastore.org/atmos-manifest.json",
  "title": "JSON Schema for Atmos Stack Manifest files. Version 1.0. https://atmos.tools",
  "type": "object",
  "properties": { ... },
  "additionalProperties": true,
  "oneOf": [ ... ],
  "definitions": { ... }
}
```

### Top-Level Properties

The `properties` object maps each top-level YAML key to a `$ref` pointing to a definition:

```json
"properties": {
  "import":       { "$ref": "#/definitions/import" },
  "terraform":    { "$ref": "#/definitions/terraform" },
  "helmfile":     { "$ref": "#/definitions/helmfile" },
  "packer":       { "$ref": "#/definitions/packer" },
// ... (8 lines trimmed)
  "dependencies": { "$ref": "#/definitions/dependencies" },
  "generate":     { "$ref": "#/definitions/generate" }
}
```

Note: Not all properties are present in all schema files. The website schema is the most complete.

### Validation Logic (oneOf)

The top-level `oneOf` ensures a manifest is either a workflows file or a stack manifest:

```json
"oneOf": [
  { "required": ["workflows"] },
  {
    "anyOf": [
      { "additionalProperties": true, "not": { "required": ["workflows"] } },
// ... (10 lines trimmed)
    ]
  }
]
```

## Definition Catalog

### import

Array of import paths (strings) or objects with `path` and options:

```json
"import": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    {
      "type": "array",
// ... (16 lines trimmed)
    }
  ]
}
```

### components

Container for terraform, helmfile, and packer component maps:

```json
"components": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    {
// ... (8 lines trimmed)
  ]
}
```

### terraform / helmfile / packer (Section-Level)

Global section-level settings. Example for `terraform`:

```json
"terraform": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    {
      "type": "object",
// ... (17 lines trimmed)
    }
  ]
}
```

### terraform_components / helmfile_components / packer_components

Maps of component names (pattern-matched) to component manifests:

```json
"terraform_components": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    {
// ... (6 lines trimmed)
  ]
}
```

The `patternProperties` key `^[/a-zA-Z0-9-_{}. ]+$` allows component names with alphanumeric
characters, hyphens, underscores, dots, spaces, slashes, and curly braces.

### terraform_component_manifest

Full Terraform component definition (website schema version):

```json
"terraform_component_manifest": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    {
      "type": "object",
// ... (21 lines trimmed)
    }
  ]
}
```

### metadata

Component metadata with type, inheritance, workspace, custom configuration, and locking:

```json
"metadata": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    {
      "type": "object",
// ... (22 lines trimmed)
    }
  ]
}
```

### settings

Settings section with validation, depends_on, spacelift, atlantis, and templates:

```json
"settings": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    {
      "type": "object",
// ... (8 lines trimmed)
    }
  ]
}
```

Note: `settings` uses `"additionalProperties": true` to allow custom user-defined settings.

### validation / validation_manifest

Validation rules for component configurations:

```json
"validation_manifest": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    {
      "type": "object",
// ... (10 lines trimmed)
    }
  ]
}
```

### backend_type

Enum of supported backend types:

```json
"backend_type": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    { "type": "string", "enum": ["local", "s3", "remote", "vault", "static", "azurerm", "gcs", "cloud"] }
  ]
}
```

### backend_manifest

Backend configuration with per-type objects:

```json
"backend_manifest": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    {
      "type": "object",
// ... (11 lines trimmed)
    }
  ]
}
```

Each backend type value is `oneOf: [!include string, object with additionalProperties: true]`.

### workflows / workflow_manifest

Workflow definitions with named steps:

```json
"workflow_manifest": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    {
      "type": "object",
// ... (24 lines trimmed)
    }
  ]
}
```

### source / source_retry (Website Schema Only)

JIT vendoring source configuration:

```json
"source": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    { "type": "string", "description": "Go-getter compatible URI..." },
    {
// ... (11 lines trimmed)
    }
  ]
}
```

### provision / provision_workdir (Website Schema Only)

Isolated workdir provisioner:

```json
"provision": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    {
// ... (6 lines trimmed)
  ]
}
```

### dependencies / dependencies_tools (Website Schema Only)

Tool dependency declarations:

```json
"dependencies": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    {
// ... (6 lines trimmed)
  ]
}
```

### generate (Website Schema Only)

Declarative file generation:

```json
"generate": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    {
// ... (8 lines trimmed)
  ]
}
```

### component_auth (Website Schema Only)

Component-level authentication with providers and identities:

```json
"component_auth": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    {
// ... (7 lines trimmed)
  ]
}
```

Related definitions: `auth_providers`, `auth_provider`, `auth_identities`, `auth_identity`,
`auth_identity_via`, `auth_session`, `auth_console`.

## Vendor Package Schema Structure

The vendor schema (`pkg/datafetcher/schema/vendor/package/1.0.json`) is a separate schema
for `vendor.yaml` files:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Atmos Vendor Config",
  "fileMatch": ["vendor.{yml,yaml}", "vendor.d/**/*.{yml,yaml}"],
  "type": "object",
// ... (32 lines trimmed)
  },
  "required": ["apiVersion", "kind", "metadata", "spec"]
}
```

## Cross-References Between Schema Files

### Feature Parity Matrix

| Definition | Website | Stack-Config | Atmos/Manifest | Config/Global |
|-----------|---------|-------------|----------------|---------------|
| import | Yes | Yes | Yes | Yes |
| components | Yes | Yes | Yes | Yes |
| terraform | Yes | Yes | Yes | Yes |
| helmfile | Yes | Yes | Yes | Yes |
| packer | Yes | Yes | Yes | Yes |
| vars | Yes | Yes | Yes | Yes |
| env | Yes | Yes | Yes | Yes |
| hooks | Yes | Yes | Yes | Yes |
| settings | Yes | Yes | Yes | Yes |
| locals | Yes | Yes | No | No |
| metadata | Yes | Yes | Yes | Yes |
| validation | Yes | Yes | Yes | Yes |
| backend_type | Yes | Yes | Yes | Yes |
| backend_manifest | Yes | Yes | Yes | Yes |
| overrides | Yes | Yes | Yes | Yes |
| workflows | Yes | Yes | Yes | Yes |
| depends_on | Yes | Yes | Yes | Yes |
| spacelift | Yes | Yes | Yes | Yes |
| atlantis | Yes | Yes | Yes | Yes |
| providers | Yes | Yes | Yes | Yes |
| templates | Yes | Yes | Yes | Yes |
| source | Yes | No | No | No |
| source_retry | Yes | No | No | No |
| provision | Yes | No | No | No |
| provision_workdir | Yes | No | No | No |
| dependencies | Yes | No | No | No |
| dependencies_tools | Yes | No | No | No |
| generate | Yes | Yes | No | No |
| component_auth | Yes | No | No | No |
| auth_* | Yes | No | No | No |
| name (top-level) | No | Yes | No | No |

### Keeping Schemas in Sync

When a feature is added:

1. Always update the **website schema** first (it is the canonical reference).
2. Then update the **stack-config schema** (used at runtime by `atmos validate stacks`).
3. Update the **atmos/manifest** and **config/global** schemas only if the feature applies
   to their respective validation domains.
4. The embedded schemas are compiled into the binary, so changes take effect at the next build.
5. The website schema is deployed when the documentation site is rebuilt.

## Adding a New Definition: Complete Example

Suppose you are adding a new `notifications` feature to Atmos components.

### 1. Define the schema

```json
"notifications": {
  "title": "notifications",
  "description": "Notification configuration for component lifecycle events",
  "oneOf": [
    {
// ... (44 lines trimmed)
    }
  ]
}
```

### 2. Add to terraform_component_manifest

```json
"terraform_component_manifest": {
  "oneOf": [
    { "type": "string", "pattern": "^!include" },
    {
// ... (8 lines trimmed)
  ]
}
```

### 3. Repeat for all schema files

Apply the same changes to all four manifest schema files (or at minimum the website and
stack-config schemas).

### 4. Validate

```shell
# Build and test
make build
atmos validate stacks
```
