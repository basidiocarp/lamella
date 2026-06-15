# Input and Error Hardening

Use this reference for validation, mutation safety, and error hygiene.

## Input Validation

```typescript
import { z } from "zod";

const CreatePostSchema = z.object({
  title: z.string().min(3).max(200),
  body: z.string().min(1),
  tags: z.array(z.string()).max(10).default([])
});
```

Validate before hitting business logic or persistence.

## Error Hygiene

- return client-safe messages
- avoid leaking stack traces, SQL fragments, or internal service names
- attach correlation IDs in logs, not raw internal details in responses

## Mutation Rules

- validate every input object
- reject unknown or excess fields where possible
- keep side effects idempotent when retries are plausible
