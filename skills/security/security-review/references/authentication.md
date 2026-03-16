# Authentication

## Password Hashing

```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
// ... (18 lines trimmed)

  return { valid: errors.length === 0, errors };
}
```

## JWT Implementation

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
// ... (22 lines trimmed)
function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
```

## Auth Middleware

```typescript
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
// ... (16 lines trimmed)
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

## Account Lockout

```typescript
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

async function handleLoginAttempt(email: string, success: boolean) {
  const key = `login:attempts:${email}`;
// ... (11 lines trimmed)
    throw new Error('Account locked. Try again later.');
  }
}
```

## Quick Reference

| Practice | Implementation |
|----------|----------------|
| Password hash | bcrypt (12+ rounds) |
| Token expiry | Access: 15m, Refresh: 7d |
| Lockout | 5 attempts, 15min lockout |
| MFA | TOTP (authenticator apps) |

| JWT Claim | Purpose |
|-----------|---------|
| `sub` | User ID |
| `exp` | Expiration |
| `iat` | Issued at |
| `type` | access/refresh |
