# Validation and SDK Generation

Use this reference when an OpenAPI spec needs linting, bundling, or generated
clients.

## Linting

Common tools:

- `spectral` for rule-based spec linting
- `redocly` for spec validation and bundling

Typical commands:

```bash
spectral lint openapi.yaml
redocly lint openapi.yaml
redocly bundle openapi.yaml -o bundled.yaml
```

## SDK Generation

`openapi-generator-cli` covers the common client targets:

```bash
openapi-generator-cli generate -i openapi.yaml -g typescript-fetch -o ./sdk
openapi-generator-cli generate -i openapi.yaml -g python -o ./python-client
```

## CI Rule

Run validation before SDK generation. Broken specs should fail the pipeline
before generated clients drift further from reality.

## Practical Rule

Treat generated SDKs as build artifacts tied to a validated spec, not as
hand-maintained source-of-truth code.
