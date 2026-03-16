---
name: auth-implementation-patterns
description: Authentication and authorization patterns -- JWT, OAuth2, sessions, RBAC, and permission-based access control. Use when implementing auth, securing APIs, or debugging auth issues.
---

# Authentication & Authorization Patterns


## Contents

- [When to Use](#when-to-use)
- [JWT Authentication](#jwt-authentication)
- [Session-Based Authentication](#session-based-authentication)
- [OAuth2 / Social Login](#oauth2-social-login)
- [Authorization Patterns](#authorization-patterns)
- [Security Essentials](#security-essentials)
- [Common Pitfalls](#common-pitfalls)

## When to Use

- Implementing user authentication (JWT, sessions, OAuth2)
- Securing REST or GraphQL APIs
- Implementing RBAC or permission-based access control
- Adding social login or SSO
- Debugging auth issues

## JWT Authentication

### Token Generation and Verification

```typescript
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JWTPayload {
  userId: string;
// ... (27 lines trimmed)
    return res.status(401).json({ error: "Invalid token" });
  }
}
```

### Refresh Token Flow

Store refresh tokens hashed in the database. On refresh: verify JWT, look up hashed token, check expiry, issue new access token. On logout: delete the stored token. On "logout all devices": delete all tokens for that user.

## Session-Based Authentication

```typescript
import session from "express-session";
import RedisStore from "connect-redis";

app.use(
  session({
// ... (9 lines trimmed)
    },
  }),
);
```

## OAuth2 / Social Login

Use Passport.js strategies (Google, GitHub, etc.). On callback, find-or-create user by provider ID, then either create a session or issue JWT tokens.

## Authorization Patterns

### RBAC with Role Hierarchy

```typescript
const roleHierarchy: Record<Role, Role[]> = {
  [Role.ADMIN]: [Role.ADMIN, Role.MODERATOR, Role.USER],
  [Role.MODERATOR]: [Role.MODERATOR, Role.USER],
  [Role.USER]: [Role.USER],
};

function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.some((role) => roleHierarchy[req.user.role].includes(role))) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}
```

### Permission-Based Access

Map roles to granular permissions (`read:users`, `write:posts`, etc.). Check with `requirePermission(Permission.READ_USERS)` middleware.

### Resource Ownership

Check `resource.userId === req.user.userId` before allowing mutations. Admins bypass ownership checks.

## Security Essentials

- Hash passwords with bcrypt (saltRounds=12) or argon2. Never store plain text.
- Short-lived access tokens (15-30 min). Long-lived refresh tokens stored hashed in DB.
- Cookie flags: `httpOnly`, `secure`, `sameSite: "strict"`.
- Rate limit auth endpoints (5 attempts per 15 min window).
- Validate all input (email format, password strength with zod or similar).
- Implement CSRF protection for session-based auth.
- Log security events: login attempts, failed auth, privilege escalation.

## Common Pitfalls

- Storing JWTs in localStorage (XSS vulnerable) -- use httpOnly cookies instead.
- Tokens without expiration.
- Auth checks only on the client side.
- Insecure password reset flows (use short-lived signed tokens).
- No rate limiting on login endpoints.
