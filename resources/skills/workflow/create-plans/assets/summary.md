# Summary Template

Standardize SUMMARY.md format for phase completion:

```markdown
# Phase [X]: [Name] Summary

**[Substantive one-liner describing outcome - NOT "phase complete" or "implementation finished"]**

## Accomplishments
// ... (49 lines trimmed)
---
*Phase: XX-name*
*Completed: [date]*
```

<one_liner_rules>
The one-liner MUST be substantive:

**Good:**
- "JWT auth with refresh rotation using jose library"
- "Prisma schema with User, Session, and Product models"
- "Dashboard with real-time metrics via Server-Sent Events"

**Bad:**
- "Phase complete"
- "Authentication implemented"
- "Foundation finished"
- "All tasks done"

The one-liner should tell someone what actually shipped.
</one_liner_rules>

<example>
```markdown
# Phase 1: Foundation Summary

**JWT auth with refresh rotation using jose library, Prisma User model, and protected API middleware**

## Accomplishments
// ... (55 lines trimmed)
---
*Phase: 01-foundation*
*Completed: 2025-01-15*
```
</example>
