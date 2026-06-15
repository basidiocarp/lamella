---
name: auth-implementation-patterns
description: "Provides authentication and authorization patterns for JWT, OAuth2, sessions, RBAC, and permission-based access control."
origin: lamella
---

# Authentication & Authorization Patterns

Use this skill when the main task is choosing or implementing an auth model, not when auditing an already-built system for broad OWASP issues.

## When to Use

- Adding JWT, session, or OAuth2 authentication
- Protecting REST or GraphQL routes
- Implementing RBAC or permission checks
- Debugging token, cookie, or session bugs
- Hardening login, refresh, or logout flows

## Core Patterns

### JWT

- Issue short-lived access tokens.
- Store refresh tokens hashed in the database.
- Prefer `httpOnly`, `secure`, `sameSite` cookies over `localStorage`.
- Reject missing, expired, or malformed tokens before route logic runs.

```typescript
function requireJwt(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ error: "Authentication required" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
```

### Sessions

- Use server-side sessions when you want revocation and simpler browser flows.
- Back sessions with Redis or another shared store in multi-instance deployments.
- Enable CSRF protection for session-authenticated form or browser flows.

```typescript
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: true, sameSite: "strict" },
  }),
);
```

### Authorization

- Use RBAC for broad role gates.
- Use permission checks for action-level control.
- Use ownership checks for per-resource writes.
- Keep authorization on the server side, not only in the client.

## Security Essentials

- Hash passwords with Argon2 or bcrypt.
- Rate-limit auth endpoints.
- Rotate or revoke refresh tokens on compromise.
- Log login failures, lockouts, and privilege changes.
- Keep reset and magic-link tokens short-lived and signed.

## Common Pitfalls

- JWTs in `localStorage`
- Tokens without expiration
- Missing CSRF protection in session flows
- Client-only auth checks
- No login throttling or suspicious-event logging
