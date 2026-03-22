# OWASP Top 10 Prevention

## OWASP Top 10 Quick Reference

| # | Vulnerability | Prevention |
|---|---------------|------------|
| 1 | Injection | Parameterized queries, ORMs |
| 2 | Broken Auth | Strong passwords, MFA, secure sessions |
| 3 | Sensitive Data | Encryption at rest/transit |
| 4 | XXE | Disable DTDs, use JSON |
| 5 | Broken Access | Deny by default, server-side validation |
| 6 | Misconfig | Security headers, disable defaults |
| 7 | XSS | Output encoding, CSP |
| 8 | Insecure Deserialization | Schema validation, allowlists |
| 9 | Known Vulnerabilities | Dependency scanning |
| 10 | Insufficient Logging | Log security events |

## A01: Injection Prevention

```typescript
// SQL Injection - Use parameterized queries
// ❌ Bad
const bad = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ Good
// ... (8 lines trimmed)

// ✅ Good - Use library functions
const files = fs.readdirSync(safeDirectory);
```

## A02: Broken Authentication

```typescript
// Use bcrypt for passwords
const hash = await bcrypt.hash(password, 12);
const isValid = await bcrypt.compare(password, hash);

// Implement account lockout
// ... (11 lines trimmed)
    maxAge: 15 * 60 * 1000, // 15 minutes
  },
}));
```

## A03: Sensitive Data Exposure

```typescript
// Encrypt sensitive data at rest
import crypto from 'crypto';

function encrypt(text: string, key: Buffer): string {
  const iv = crypto.randomBytes(16);
// ... (8 lines trimmed)
  }
  next();
});
```

## A05: Broken Access Control

```typescript
// Always validate on server side
async function getResource(userId: string, resourceId: string) {
  const resource = await db.resource.findUnique({ where: { id: resourceId } });

  // Verify ownership
// ... (13 lines trimmed)
    next();
  };
}
```

## A07: XSS Prevention

```typescript
// Use Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
  },
}));

// Sanitize user input for HTML
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
```

## Quick Reference

| Attack | Defense |
|--------|---------|
| SQL Injection | Parameterized queries |
| XSS | Output encoding, CSP |
| CSRF | CSRF tokens |
| IDOR | Authorization checks |
| Command Injection | Avoid exec(), validate input |
