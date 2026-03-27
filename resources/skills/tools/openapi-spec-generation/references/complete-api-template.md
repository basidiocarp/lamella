# Complete API Template

Use a full template only as a bootstrap artifact, not as a permanent dumping
ground for every OpenAPI feature.

## Keep the Template Minimal

A good starter template should include:

- `openapi`, `info`, and `servers`
- one representative path
- one schema example
- one error response
- one auth scheme if the API requires it

## Recommended Shape

```yaml
openapi: 3.1.0
info:
  title: Example API
  version: 1.0.0
paths:
  /users:
    get:
      operationId: listUsers
      responses:
        '200':
          description: OK
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
```

## Practical Rule

Keep generated or starter specs small enough that teams can actually review
them. Expand only when a concrete endpoint or schema needs to exist.
