# Operational Patterns

Use this page for backend concerns that sit between application code and
production runtime behavior.

## Rate Limiting

- keep auth, write-heavy, and public-read endpoints on separate budgets
- enforce rate limits in shared middleware so every route returns the same error
  shape
- use Redis or another shared store once you have more than one process

```typescript
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
})
```

## Background Jobs

- queue work that is slow, retryable, or safe to run after the request returns
- keep the API response small: return the accepted job id, not the whole worker
  result
- make retries explicit and idempotent so duplicate delivery does not corrupt
  state

```typescript
type EmailJob = { userId: string; template: 'welcome' | 'receipt' }

await jobQueue.add<EmailJob>('email', {
  userId,
  template: 'welcome',
})

return NextResponse.json({ accepted: true }, { status: 202 })
```

## Structured Logging

- log objects, not concatenated strings
- include request id, route, actor, and deployment metadata on every entry
- treat stack traces and raw request bodies as error-only fields

```typescript
logger.info('market created', {
  requestId: req.id,
  userId: req.user.id,
  marketId,
  route: req.path,
})
```

## Error Handling

- convert domain errors into a stable HTTP error shape in one place
- distinguish client, auth, conflict, and retryable infrastructure failures
- add retry logic only around transient operations such as HTTP calls or queue
  publishes

```typescript
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code: string,
  ) {
    super(message)
  }
}

export async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let attempt = 0
  while (true) {
    try {
      return await fn()
    } catch (error) {
      if (attempt >= retries) throw error
      attempt += 1
      await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 100))
    }
  }
}
```
