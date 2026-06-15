## Authentication & Authorization

### JWT Token Validation

```typescript
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

interface JWTPayload {
  userId: string
  email: string
  role: 'admin' | 'moderator' | 'user'
}

function verifyToken(authHeader: string | null): JWTPayload {
  const token = authHeader?.replace(/^Bearer\s+/i, '')
  if (!token) throw new Error('Missing token')
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
}

export async function GET(request: Request) {
  try {
    const user = verifyToken(request.headers.get('authorization'))
    const data = await getDataForUser(user.userId)
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false }, { status: 401 })
  }
}
```

### Role-Based Access Control

```typescript
type Permission = 'read' | 'write' | 'delete' | 'admin'

const rolePermissions = {
  admin: ['read', 'write', 'delete', 'admin'],
  moderator: ['read', 'write'],
  user: ['read'],
} satisfies Record<string, Permission[]>

function requirePermission(role: keyof typeof rolePermissions, permission: Permission) {
  if (!rolePermissions[role].includes(permission)) {
    throw new Error('Forbidden')
  }
}
```

## Rate Limiting

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(60, '1 m'),
})

export async function requireRateLimit(identifier: string) {
  const result = await ratelimit.limit(identifier)
  if (!result.success) {
    throw new Error('Rate limit exceeded')
  }
}
```
