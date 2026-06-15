# SQL Optimization Patterns

Use this page as the routing layer for optimization work. The previous version mixed plan inspection, index design, anti-pattern repair, and operations guidance into one large partial handbook.

## Reference Map

| Need | Load |
|------|------|
| Reading `EXPLAIN`, plan shape, and index selection | [explain-and-indexes.md](explain-and-indexes.md) |
| Fixing query anti-patterns like N+1 and pagination drift | [query-pattern-fixes.md](query-pattern-fixes.md) |
| Monitoring, maintenance, and regression checks | [profiling-and-maintenance.md](profiling-and-maintenance.md) |

## Use This Ref When

- You need to choose the right optimization workflow before diving into a specific query or plan.
- The user asks for slow-query triage, index advice, or SQL performance debugging.
