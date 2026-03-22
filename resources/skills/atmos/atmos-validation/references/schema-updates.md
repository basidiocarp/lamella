# How to Update Schemas When Adding New Features

When you add a new feature to Atmos that introduces new configuration keys in stack manifests,
update the JSON Schema files. Failure to do so causes validation errors for users who
rely on `atmos validate stacks` or IDE auto-completion.

## Which Schema Files to Update

For feature work, always update the **website schema** and **stack-config schema** first.
Then update the other two when the new keys or structure apply to their domains.

| File | Purpose |
|------|---------|
| `website/static/schemas/atmos/atmos-manifest/1.0/atmos-manifest.json` | Public schema (website, SchemaStore, IDE) |
| `pkg/datafetcher/schema/stacks/stack-config/1.0.json` | Primary embedded schema for `validate stacks` |
| `pkg/datafetcher/schema/atmos/manifest/1.0.json` | Minimal embedded manifest schema |
| `pkg/datafetcher/schema/config/global/1.0.json` | Global config validation schema |

The **website schema** and the **stack-config schema** are the most complete and feature-rich.
Update **atmos/manifest** and **config/global** when adding top-level or structural changes that
affect their respective domains.

For vendor manifest changes, update:
- `pkg/datafetcher/schema/vendor/package/1.0.json`

## Step-by-Step: Adding a New Top-Level Property

1. **Add the property reference in the top-level `properties` object** in each schema file:

```json
{
  "properties": {
    "existing_prop": { "$ref": "#/definitions/existing_prop" },
    "my_new_prop": { "$ref": "#/definitions/my_new_prop" }
  }
}
```

2. **Add the definition** in the `definitions` section. Follow the Atmos `!include` pattern:

```json
{
  "definitions": {
    "my_new_prop": {
      "title": "my_new_prop",
      "description": "Description of the new property",
// ... (21 lines trimmed)
    }
  }
}
```

3. **If the property should make a manifest valid on its own**, add it to the `oneOf` > `anyOf` array:

```json
{
  "oneOf": [
    { "required": ["workflows"] },
    {
      "anyOf": [
        { "required": ["import"] },
        { "required": ["my_new_prop"] }
      ]
    }
  ]
}
```

4. **Update all four schema files** with the same changes.

## Step-by-Step: Adding a Property to a Component Manifest

To add a new property at the component level (inside `components.terraform.<name>`):

1. **Add the property to `terraform_component_manifest`** (and/or `helmfile_component_manifest`,
   `packer_component_manifest` as appropriate):

```json
{
  "definitions": {
    "terraform_component_manifest": {
      "oneOf": [
        { "type": "string", "pattern": "^!include" },
// ... (9 lines trimmed)
    }
  }
}
```

2. **Create the definition** for your new field as shown above.

## Step-by-Step: Adding a Property to an Existing Definition

To add a new field to an existing definition (e.g., adding a field to `metadata`):

1. **Locate the definition** in the `definitions` section.

2. **Add the property** inside the object variant of the `oneOf`:

```json
{
  "definitions": {
    "metadata": {
      "oneOf": [
        { "type": "string", "pattern": "^!include" },
// ... (13 lines trimmed)
    }
  }
}
```

## The !include Pattern

Every definition in the Atmos schema supports the `!include` YAML tag pattern. Each definition uses `oneOf` with the first option being a string matching `^!include` and the second being the actual type definition:

```json
"oneOf": [
  {
    "type": "string",
    "pattern": "^!include"
  },
  {
    "type": "object",
    ...
  }
]
```

Always include this pattern when creating new definitions. It enables users to use `!include` directives
to load sections from external files.

## JSON Schema 2020-12 Quick Reference

Common patterns used in Atmos schemas:

```json
// String with enum
{ "type": "string", "enum": ["value1", "value2"] }

// Boolean
{ "type": "boolean", "description": "Flag description" }
// ... (21 lines trimmed)

// Reference to another definition
{ "$ref": "#/definitions/my_definition" }
```

## Differences Between Schema Files

The four manifest schema files are mostly identical but have some differences:

- **Website schema** (`website/static/`) -- The most complete. Includes `locals`, `dependencies`,
  `generate`, `provision`, `source`, `auth`, and `component_auth` definitions. Has `source_retry`,
  `auth_providers`, `auth_identities`, `auth_identity`, `auth_identity_via`, `auth_session`,
  and `auth_console` definitions.

- **Stack-config schema** (`pkg/datafetcher/schema/stacks/`) -- Has `name` as a top-level property
  (with description: "Logical name for this stack"). Has `locals` definition. May include
  additional definitions like `name` in the `metadata` section. Missing some newer definitions
  that are in the website schema (e.g., `generate`, `provision`, `source`, `auth`).

- **Atmos manifest schema** (`pkg/datafetcher/schema/atmos/`) -- Minimal. Does not have `locals`,
  `dependencies`, `generate`, `provision`, `source`, or `auth` definitions.

- **Global config schema** (`pkg/datafetcher/schema/config/`) -- Similar to atmos manifest, used
  for global config validation.

When adding new features, the minimum required updates are the **website schema** and the
**stack-config schema**. Also update **atmos/manifest** when manifest-level validation is affected,
and **config/global** when global config validation is affected.

## Checklist for Schema Updates

When adding a new Atmos feature with configuration keys:

- [ ] Add the definition to `website/static/schemas/atmos/atmos-manifest/1.0/atmos-manifest.json`
- [ ] Add the definition to `pkg/datafetcher/schema/stacks/stack-config/1.0.json`
- [ ] Add the definition to `pkg/datafetcher/schema/atmos/manifest/1.0.json` (if applicable)
- [ ] Add the definition to `pkg/datafetcher/schema/config/global/1.0.json` (if applicable)
- [ ] Add property references in top-level `properties` or component manifest `properties`
- [ ] Include the `!include` pattern in `oneOf` for all new object definitions
- [ ] Add `description` fields for IDE auto-completion hover text
- [ ] Test with `atmos validate stacks` to ensure no regressions
- [ ] Verify IDE auto-completion works with the updated schema
