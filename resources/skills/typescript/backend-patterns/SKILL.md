---
name: backend-patterns
description: "Applies backend architecture and production Node.js patterns."
origin: lamella
---

# Backend Development Patterns

Use this skill for production Node.js backend design once the framework basics are already known. Keep the main skill focused on architecture choices and route deeper examples into the reference files.

## When to Use

- Designing API layers and service boundaries
- Choosing repository, service, and middleware patterns
- Adding transactions, caching, validation, or graceful shutdown
- Reviewing backend code for production-readiness gaps

## Core Workflow

1. Choose the API and domain boundaries.
2. Keep transport, domain, and persistence responsibilities separate.
3. Add validation and error handling at the edge.
4. Add transactions and cache behavior where state changes matter.
5. Add shutdown and operational patterns before production rollout.

## References

- [references/api-patterns.md](references/api-patterns.md)
- [references/auth-patterns.md](references/auth-patterns.md)
- [references/caching-strategies.md](references/caching-strategies.md)
- [references/data-layer.md](references/data-layer.md)
- [references/database-patterns.md](references/database-patterns.md)
- [references/infrastructure.md](references/infrastructure.md)
- [references/operational-patterns.md](references/operational-patterns.md)
- [references/security-patterns.md](references/security-patterns.md)
