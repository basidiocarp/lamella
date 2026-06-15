# Security Guidelines

Use secure defaults and stop on credible security risk.

## Rules

- never commit hardcoded secrets
- validate untrusted input at the boundary
- use framework-safe query and rendering paths instead of ad hoc escaping
- avoid leaking sensitive details in errors, logs, or docs
- if a real security issue appears, stop, scope it, and review adjacent surfaces before continuing
