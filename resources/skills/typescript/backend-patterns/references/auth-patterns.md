# Authentication & Authorization Patterns

## JWT Token Validation

```typescript
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

interface JWTPayload {
  userId: string
  email: string
  role: 'admin' | 'moderator' | 'user'
}

function requireUser(request: NextRequest): JWTPayload {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) throw new Error('Missing token')

  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
}

export async function GET(request: NextRequest) {
  try {
    const user = requireUser(request)
    const data = await getDataForUser(user.userId)
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
}
```

---

## Role-Based Access Control

```typescript
type Permission = 'read' | 'write' | 'delete' | 'admin'

interface User {
  id: string
  role: 'admin' | 'moderator' | 'user'
}

const rolePermissions: Record<User['role'], Permission[]> = {
  admin: ['read', 'write', 'delete', 'admin'],
  moderator: ['read', 'write'],
  user: ['read'],
}

function requirePermission(user: User, permission: Permission) {
  if (!rolePermissions[user.role].includes(permission)) {
    throw new Error('Forbidden')
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    requirePermission(user, 'delete')
    await deleteRecord()
    return new Response('Deleted', { status: 200 })
  } catch (error) {
    return new Response(error instanceof Error ? error.message : 'Forbidden', { status: 403 })
  }
}
```
