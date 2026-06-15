---
name: openapi-spec-generation
description: "Generates and maintains OpenAPI 3.1 specifications from code, design-first specs, and validation patterns."
origin: lamella
---

# OpenAPI Spec Generation

Use this skill when creating or maintaining OpenAPI 3.1 contracts.

## When to Use

- designing a new REST API contract
- generating a spec from an existing API
- validating specs and generating SDKs
- tightening documentation around schemas, errors, or security schemes

## Core Workflow

1. choose design-first, code-first, or hybrid
2. define paths, operations, schemas, and security
3. validate with linting tools before publishing
4. generate SDKs or docs from the validated spec

## Quick Commands

```shell
spectral lint openapi.yaml
redocly lint openapi.yaml
openapi-generator-cli generate -i openapi.yaml -g typescript-fetch -o ./sdk
```

## References

- [references/complete-api-template.md](references/complete-api-template.md)
- [references/code-first-examples.md](references/code-first-examples.md)
- [references/validation-and-sdk.md](references/validation-and-sdk.md)
