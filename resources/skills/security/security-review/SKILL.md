---
name: security-review
description: "Reviews code against OWASP patterns and secure coding practices."
origin: lamella
---

# Security Review Skill


## Contents

- [When to Use](#when-to-use)
- [Core Workflow](#core-workflow)
- [Security Checklist](#security-checklist)
- [Secure Coding Constraints](#secure-coding-constraints)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Quick Patterns](#quick-patterns)
- [Reference Guide](#reference-guide)
- [Resources](#resources)

Ensures all code follows security best practices, identifies potential vulnerabilities, and implements defense-in-depth secure coding patterns.

## When to Use

- Implementing authentication or authorization
- Handling user input or file uploads
- Creating new API endpoints
- Working with secrets or credentials
- Implementing payment features
- Storing or transmitting sensitive data
- Integrating third-party APIs
- Security hardening existing code
- Implementing encryption
- Implementing secure session management

## Core Workflow

1. **Threat model** - Identify attack surface and threats
2. **Design** - Plan security controls
3. **Implement** - Write secure code with defense in depth
4. **Validate** - Test security controls
5. **Document** - Record security decisions

## Security Checklist

### 1. Secrets Management
- [ ] No hardcoded API keys, tokens, or passwords
- [ ] All secrets in environment variables
- [ ] `.env.local` in .gitignore
- [ ] No secrets in git history
- [ ] Production secrets in hosting platform

### 2. Input Validation
- [ ] All user inputs validated with schemas (Zod)
- [ ] File uploads restricted (size, type, extension)
- [ ] No direct use of user input in queries
- [ ] Whitelist validation (not blacklist)
- [ ] Error messages don't leak sensitive info

### 3. SQL Injection Prevention
- [ ] All database queries use parameterized queries
- [ ] No string concatenation in SQL
- [ ] ORM/query builder used correctly

### 4. Authentication & Authorization
- [ ] Tokens stored in httpOnly cookies (not localStorage)
- [ ] Authorization checks before sensitive operations
- [ ] Row Level Security enabled in Supabase
- [ ] Role-based access control implemented
- [ ] Session management secure

### 5. XSS Prevention
- [ ] User-provided HTML sanitized (DOMPurify)
- [ ] CSP headers configured
- [ ] No unvalidated dynamic content rendering
- [ ] React's built-in XSS protection used

### 6. CSRF Protection
- [ ] CSRF tokens on state-changing operations
- [ ] SameSite=Strict on all cookies
- [ ] Double-submit cookie pattern implemented

### 7. Rate Limiting
- [ ] Rate limiting on all API endpoints
- [ ] Stricter limits on expensive operations
- [ ] IP-based and user-based rate limiting

### 8. Sensitive Data Exposure
- [ ] No passwords, tokens, or secrets in logs
- [ ] Error messages generic for users
- [ ] Detailed errors only in server logs
- [ ] No stack traces exposed to users

### 9. Blockchain Security (Solana)
- [ ] Wallet signatures verified
- [ ] Transaction details validated
- [ ] Balance checks before transactions
- [ ] No blind transaction signing

### 10. Dependency Security
- [ ] Dependencies up to date
- [ ] No known vulnerabilities (npm audit clean)
- [ ] Lock files committed
- [ ] Dependabot enabled on GitHub

## Secure Coding Constraints

### MUST DO
- Hash passwords with bcrypt/argon2 (never plaintext)
- Use parameterized queries (prevent SQL injection)
- Validate and sanitize all user input
- Implement rate limiting on auth endpoints
- Use HTTPS everywhere
- Set security headers (CSP, X-Frame-Options, HSTS)
- Log security events
- Store secrets in environment/secret managers

### MUST NOT DO
- Store passwords in plaintext
- Trust user input without validation
- Expose sensitive data in logs or errors
- Use weak encryption algorithms
- Hardcode secrets in code
- Disable security features for convenience

## Pre-Deployment Checklist

- [ ] **Secrets**: No hardcoded secrets, all in env vars
- [ ] **Input Validation**: All user inputs validated
- [ ] **SQL Injection**: All queries parameterized
- [ ] **XSS**: User content sanitized
- [ ] **CSRF**: Protection enabled
- [ ] **Authentication**: Proper token handling
- [ ] **Authorization**: Role checks in place
- [ ] **Rate Limiting**: Enabled on all endpoints
- [ ] **HTTPS**: Enforced in production
- [ ] **Security Headers**: CSP, X-Frame-Options configured
- [ ] **Dependencies**: Up to date, no vulnerabilities

## Quick Patterns

**Secrets:**
```typescript
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) throw new Error('OPENAI_API_KEY not configured')
```

**Input Validation:**
```typescript
import { z } from 'zod'
const schema = z.object({ email: z.string().email() })
const validated = schema.parse(input)
```

**Parameterized Query:**
```typescript
const { data } = await supabase.from('users').select('*').eq('email', userEmail)
```

**httpOnly Cookie:**
```typescript
res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict`)
```

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| OWASP | [references/owasp-prevention.md](references/owasp-prevention.md) | OWASP Top 10 prevention patterns |
| Authentication | [references/authentication.md](references/authentication.md) | Password hashing, JWT, OAuth 2.0 |
| Input Validation | [references/input-validation.md](references/input-validation.md) | Zod schemas, SQL injection prevention |
| XSS/CSRF | [references/xss-csrf.md](references/xss-csrf.md) | XSS prevention, CSRF protection |
| Headers | [references/security-headers.md](references/security-headers.md) | Helmet, rate limiting, CSP |
| Code Examples | [references/code-examples.md](references/code-examples.md) | Full code examples for all patterns |
| Cloud Security | [references/cloud-infrastructure-security.md](references/cloud-infrastructure-security.md) | Cloud infrastructure security |

## Output Templates

When implementing security features, provide:
1. Secure implementation code
2. Security considerations noted
3. Configuration requirements (env vars, headers)
4. Testing recommendations

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/security)
- Knowledge domains: OWASP Top 10, bcrypt/argon2, JWT, OAuth 2.0, OIDC, CSP, CORS, rate limiting, input validation, output encoding, encryption (AES, RSA), TLS, security headers

---

**Remember**: Security is not optional. One vulnerability can compromise the entire platform.
