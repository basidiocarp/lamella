## Authentication & Authorization

### JWT Token Validation

```typescript
import jwt from 'jsonwebtoken'

interface JWTPayload {
  userId: string
  email: string
// ... (27 lines trimmed)

  return NextResponse.json({ success: true, data })
}
```

### Role-Based Access Control

```typescript
type Permission = 'read' | 'write' | 'delete' | 'admin'

interface User {
  id: string
  role: 'admin' | 'moderator' | 'user'
// ... (30 lines trimmed)
    return new Response('Deleted', { status: 200 })
  }
)
```


## Rate Limiting

### Simple In-Memory Rate Limiter

```typescript
class RateLimiter {
  private requests = new Map<string, number[]>()

  async checkLimit(
    identifier: string,
// ... (33 lines trimmed)

  // Continue with request
}
```
