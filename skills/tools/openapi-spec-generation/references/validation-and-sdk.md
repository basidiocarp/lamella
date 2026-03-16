# Validation, Linting & SDK Generation

Tools and configurations for validating OpenAPI specs and generating client SDKs.

## Validation Tools Setup

```bash
# Install validation tools
npm install -g @stoplight/spectral-cli
npm install -g @redocly/cli
```

## Spectral Configuration

Create `.spectral.yaml` in your project root:

```yaml
extends: ["spectral:oas", "spectral:asyncapi"]

rules:
  # Enforce operation IDs
  operation-operationId: error
// ... (29 lines trimmed)
      function: casing
      functionOptions:
        type: camel
```

### Run Spectral

```bash
spectral lint openapi.yaml
```

## Redocly Configuration

Create `redocly.yaml` in your project root:

```yaml
extends:
  - recommended

rules:
  no-invalid-media-type-examples: error
// ... (16 lines trimmed)
        - lang: curl
        - lang: python
        - lang: javascript
```

### Run Redocly

```bash
# Lint spec
redocly lint openapi.yaml

# Bundle multiple files into one
redocly bundle openapi.yaml -o bundled.yaml

# Preview documentation locally
redocly preview-docs openapi.yaml
```

## SDK Generation

Use OpenAPI Generator to create client SDKs in multiple languages.

### Installation

```bash
npm install -g @openapitools/openapi-generator-cli
```

### TypeScript Client

```bash
openapi-generator-cli generate \
  -i openapi.yaml \
  -g typescript-fetch \
  -o ./generated/typescript-client \
  --additional-properties=supportsES6=true,npmName=@myorg/api-client
```

### Python Client

```bash
openapi-generator-cli generate \
  -i openapi.yaml \
  -g python \
  -o ./generated/python-client \
  --additional-properties=packageName=api_client
```

### Go Client

```bash
openapi-generator-cli generate \
  -i openapi.yaml \
  -g go \
  -o ./generated/go-client
```

### Available Generators

| Generator | Language/Framework |
|-----------|-------------------|
| `typescript-fetch` | TypeScript with Fetch API |
| `typescript-axios` | TypeScript with Axios |
| `python` | Python with urllib3 |
| `python-pydantic-v1` | Python with Pydantic v1 |
| `go` | Go |
| `java` | Java |
| `kotlin` | Kotlin |
| `swift5` | Swift 5 |
| `csharp` | C# |
| `rust` | Rust |

### Custom Templates

```bash
# List available templates
openapi-generator-cli author template -g typescript-fetch --list

# Extract templates for customization
openapi-generator-cli author template \
  -g typescript-fetch \
  -o ./templates/typescript-fetch
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: OpenAPI Validation
on: [push, pull_request]

jobs:
  validate:
// ... (19 lines trimmed)
            -i openapi.yaml \
            -g typescript-fetch \
            -o ./sdk
```
