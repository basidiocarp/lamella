## Error Handling Patterns

### Centralized Error Handler

```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
// ... (37 lines trimmed)
    return errorHandler(error, request)
  }
}
```

### Retry with Exponential Backoff

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error
// ... (17 lines trimmed)

// Usage
const data = await fetchWithRetry(() => fetchFromAPI())
```


## Background Jobs & Queues

### Simple Queue Pattern

```typescript
class JobQueue<T> {
  private queue: T[] = []
  private processing = false

  async add(job: T): Promise<void> {
// ... (40 lines trimmed)

  return NextResponse.json({ success: true, message: 'Job queued' })
}
```


## Logging & Monitoring

### Structured Logging

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

**Remember**: Backend patterns enable scalable, maintainable server-side applications. Choose patterns that fit your complexity level.
