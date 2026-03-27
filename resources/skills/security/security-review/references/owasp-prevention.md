# OWASP Top 10 Prevention

Use this reference as the compact routing layer for common web-app prevention patterns.

## Quick Map

| Risk | Primary Defense |
|------|-----------------|
| Injection | Parameterized queries, safe command construction, allowlists |
| Broken auth | Strong password storage, MFA, session hardening |
| Sensitive data exposure | Encryption at rest and in transit, secret handling |
| Broken access control | Deny by default, server-side authorization |
| Security misconfiguration | Safe defaults, headers, dependency hygiene |
| XSS | Output encoding, sanitization, CSP |
| Unsafe deserialization | Schema validation, type allowlists |

## Rule

Treat this page as the prevention index. Load the narrower auth, access-control, or input-handling refs when the task needs implementation detail rather than a broad checklist.
