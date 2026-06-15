# GraphQL Security

Use this file as the routing page for GraphQL hardening.

## Open These References By Task

1. [query-guardrails.md](./query-guardrails.md)
   Use for depth limits, complexity analysis, persisted queries, and request
   throttling.
2. [auth-and-authorization.md](./auth-and-authorization.md)
   Use for context auth, directive-based access control, and field-level
   permissions.
3. [input-and-error-hardening.md](./input-and-error-hardening.md)
   Use for input validation, safe error responses, and mutation hygiene.
4. [transport-and-introspection.md](./transport-and-introspection.md)
   Use for introspection policy, CSRF, CORS, and production transport checks.

## Core Security Rules

- limit query cost before execution
- authenticate once in context and authorize close to the field boundary
- validate all mutation inputs
- do not leak internal errors or schema surface unnecessarily in production
