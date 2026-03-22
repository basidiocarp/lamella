---
name: openapi-spec-generation
description: Generate and maintain OpenAPI 3.1 specifications from code, design-first specs, and validation patterns. Use when creating API documentation, generating SDKs, or ensuring API contract compliance.
---

# OpenAPI Spec Generation

Comprehensive patterns for creating, maintaining, and validating OpenAPI 3.1 specifications for RESTful APIs.

## Contents

- [When to Use This Skill](#when-to-use-this-skill)
- [Core Concepts](#core-concepts)
- [Workflow](#workflow)
- [Quick Reference](#quick-reference)
- [Best Practices](#best-practices)
- [Reference Files](#reference-files)
- [Resources](#resources)

## When to Use This Skill

- Creating API documentation from scratch
- Generating OpenAPI specs from existing code
- Designing API contracts (design-first approach)
- Validating API implementations against specs
- Generating client SDKs from specs
- Setting up API documentation portals

## Core Concepts

### OpenAPI 3.1 Structure

```yaml
openapi: 3.1.0
info:
  title: API Title
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
paths:
  /resources:
    get: ...
components:
  schemas: ...
  securitySchemes: ...
```

### Design Approaches

| Approach         | Description                  | Best For            |
| ---------------- | ---------------------------- | ------------------- |
| **Design-First** | Write spec before code       | New APIs, contracts |
| **Code-First**   | Generate spec from code      | Existing APIs       |
| **Hybrid**       | Annotate code, generate spec | Evolving APIs       |

## Workflow

### Design-First

1. Define info, servers, tags
2. Design paths and operations
3. Create component schemas
4. Add security schemes
5. Validate with Spectral/Redocly
6. Generate SDK clients

### Code-First

1. Add framework decorators (FastAPI, tsoa)
2. Define Pydantic/TypeScript models
3. Export OpenAPI JSON/YAML
4. Validate and lint
5. Generate documentation

## Quick Reference

### Essential Components

```yaml
# Reusable parameter
components:
  parameters:
    PageParam:
      name: page
// ... (20 lines trimmed)
      type: http
      scheme: bearer
      bearerFormat: JWT
```

### Common Patterns

```yaml
# Pagination response
UserListResponse:
  type: object
  properties:
    data:
// ... (21 lines trimmed)
            type: string
          message:
            type: string
```

### Validation Commands

```bash
# Spectral
npm install -g @stoplight/spectral-cli
spectral lint openapi.yaml

# Redocly
npm install -g @redocly/cli
redocly lint openapi.yaml
redocly preview-docs openapi.yaml
```

### SDK Generation

```bash
npm install -g @openapitools/openapi-generator-cli

# TypeScript
openapi-generator-cli generate -i openapi.yaml -g typescript-fetch -o ./sdk

# Python
openapi-generator-cli generate -i openapi.yaml -g python -o ./sdk
```

## Best Practices

### Do's

- **Use $ref** - Reuse schemas, parameters, responses
- **Add examples** - Real-world values help consumers
- **Document errors** - All possible error codes
- **Version your API** - In URL or header
- **Use semantic versioning** - For spec changes

### Don'ts

- **Don't use generic descriptions** - Be specific
- **Don't skip security** - Define all schemes
- **Don't forget nullable** - Be explicit about null
- **Don't mix styles** - Consistent naming throughout
- **Don't hardcode URLs** - Use server variables

## Reference Files

Detailed templates and examples:

- [references/complete-api-template.md](references/complete-api-template.md) - Full OpenAPI 3.1 spec with all components
- [references/code-first-examples.md](references/code-first-examples.md) - Python/FastAPI and TypeScript/tsoa examples
- [references/validation-and-sdk.md](references/validation-and-sdk.md) - Spectral, Redocly config, and SDK generation

## Resources

- [OpenAPI 3.1 Specification](https://spec.openapis.org/oas/v3.1.0)
- [Swagger Editor](https://editor.swagger.io/)
- [Redocly](https://redocly.com/)
- [Spectral](https://stoplight.io/open-source/spectral)
