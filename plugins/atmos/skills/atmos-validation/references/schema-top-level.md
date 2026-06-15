# Schema Top-Level Structure

## File Locations

Important schema locations:

- public Atmos manifest schema under the website static schema path
- embedded global config schema under the Go datafetcher package

## Common Top-Level Shape

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://json.schemastore.org/atmos-manifest.json",
  "type": "object",
  "properties": { },
  "additionalProperties": true,
  "oneOf": [ ],
  "definitions": { }
}
```

## Validation Gate

The top-level `oneOf` distinguishes workflow manifests from stack manifests. That is the first check to understand when a document unexpectedly fails validation.
