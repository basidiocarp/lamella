# Security Headers

## Helmet for Express

```typescript
import helmet from "helmet"

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
)
```

## Manual Headers

```typescript
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY")
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
  next()
})
```

## Rate Limiting

```typescript
import rateLimit from "express-rate-limit"

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
})
```

Use stricter limits on login, registration, reset, and token-minting paths.

## CORS

```typescript
import cors from "cors"

app.use(
  cors({
    origin: ["https://example.com", "https://app.example.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
)
```

Review for:

- wildcard origins with credentials
- unused methods left open
- broad dev-only settings leaking to production

## Cookie Flags

```typescript
res.cookie("session", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 900000,
  path: "/",
})
```

## Quick Reference

| Header | Purpose |
|--------|---------|
| `X-Frame-Options: DENY` | clickjacking protection |
| `X-Content-Type-Options: nosniff` | MIME sniffing protection |
| `Strict-Transport-Security` | HTTPS enforcement |
| `Content-Security-Policy` | script and resource control |
| `Referrer-Policy` | referrer data minimization |
