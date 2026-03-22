# Operational Patterns

## Rate Limiting

### Simple In-Memory Rate Limiter

```typescript
class RateLimiter {
  private requests = new Map<string, number[]>()

  async checkLimit(
    identifier: string,
// ... (31 lines trimmed)

  // Continue with request
}
```

---

## Background Jobs & Queues

### Simple Queue Pattern

```typescript
class JobQueue<T> {
  private queue: T[] = []
  private processing = false

  async add(job: T): Promise<void> {
// ... (38 lines trimmed)

  return NextResponse.json({ success: true, message: 'Job queued' })
}
```

---

## Structured Logging

```typescript
interface LogContext {
  userId?: string
  requestId?: string
  method?: string
  path?: string
// ... (49 lines trimmed)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

---

## Error Handling

### Centralized Error Handler

```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
// ... (27 lines trimmed)
    error: 'Internal server error'
  }, { status: 500 })
}
```

### Retry with Exponential Backoff

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error
// ... (14 lines trimmed)

  throw lastError!
}
```
