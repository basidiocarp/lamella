# Database Dialect Differences

Use this page to route cross-database portability questions. The detailed comparisons now live in focused refs instead of one long mixed matrix.

## Reference Map

| Need | Load |
|------|------|
| Identity columns, pagination, and limit semantics | [ids-and-pagination.md](ids-and-pagination.md) |
| Date functions, booleans, concatenation, and case behavior | [dates-booleans-and-strings.md](dates-booleans-and-strings.md) |
| JSON support and vendor-specific document operators | [json-and-document-types.md](json-and-document-types.md) |

## Practical Rule

- If the query must run across engines, verify both syntax and behavioral differences.
- Do not assume pagination, boolean, or JSON behavior is interchangeable across PostgreSQL, MySQL, SQL Server, and Oracle.
