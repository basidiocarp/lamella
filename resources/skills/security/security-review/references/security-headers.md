# Security Headers

## Helmet (Express)

```typescript
import helmet from 'helmet';

app.use(helmet()); // Enable all defaults

// Or configure individually
// ... (11 lines trimmed)
    preload: true,
  },
}));
```

## Manual Headers

```typescript
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME sniffing
// ... (10 lines trimmed)

  next();
});
```

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
// ... (15 lines trimmed)

app.post('/api/login', authLimiter, loginHandler);
app.post('/api/register', authLimiter, registerHandler);
```

## CORS Configuration

```typescript
import cors from 'cors';

// Strict CORS
app.use(cors({
  origin: ['https://example.com', 'https://app.example.com'],
// ... (14 lines trimmed)
    }
  },
}));
```

## Cookie Security

```typescript
res.cookie('session', token, {
  httpOnly: true,      // No JavaScript access
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 900000,      // 15 minutes
  path: '/',
  domain: '.example.com',
});
```

## Quick Reference

| Header | Value | Purpose |
|--------|-------|---------|
| X-Frame-Options | DENY | Clickjacking |
| X-Content-Type-Options | nosniff | MIME sniffing |
| Strict-Transport-Security | max-age=31536000 | Force HTTPS |
| Content-Security-Policy | default-src 'self' | XSS |
| Referrer-Policy | strict-origin-when-cross-origin | Privacy |

| Cookie Flag | Purpose |
|-------------|---------|
| httpOnly | No JS access |
| secure | HTTPS only |
| sameSite=strict | CSRF protection |
| maxAge | Expiration |
