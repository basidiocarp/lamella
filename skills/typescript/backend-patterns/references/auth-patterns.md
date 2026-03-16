# Authentication & Authorization Patterns

## JWT Token Validation

```typescript
import jwt from 'jsonwebtoken'

interface JWTPayload {
  userId: string
  email: string
// ... (25 lines trimmed)
  const data = await getDataForUser(user.userId)
  return NextResponse.json({ success: true, data })
}
```

---

## Role-Based Access Control

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
