# Input Validation

Treat validation as a layered defense, not a single library call.

## Core Rules

- Validate structure first, then enforce business constraints.
- Prefer allowlists and typed parsing over string cleanup.
- Use downstream APIs that preserve safety, such as parameterized queries or
  `execFile`.
- Re-check filesystem and URL boundaries after normalization or resolution.

## Common Cases

| Input Type | Primary Control |
| --- | --- |
| SQL parameters | parameterized queries or query builders |
| file paths | basename or allowlist plus resolved-path boundary check |
| shell commands | no shell interpolation; use argument arrays or libraries |
| URLs | protocol plus host allowlist |
| file uploads | MIME, size, and magic-byte checks |

## High-Signal Example

```typescript
function validateUrl(input: string, allowedHosts: string[]): URL {
  const url = new URL(input);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Invalid protocol");
  }

  if (!allowedHosts.includes(url.hostname)) {
    throw new Error("Host not allowed");
  }

  return url;
}
```

If the validation rule changes security posture, keep the failure explicit and
auditable.
