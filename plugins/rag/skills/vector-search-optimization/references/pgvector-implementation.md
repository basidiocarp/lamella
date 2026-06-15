# pgvector Implementation

Use pgvector when retrieval needs to stay close to relational data and SQL workflows.

## Best Fit

- Small to medium vector workloads
- Strong transactional coupling with application data
- Teams already operating PostgreSQL heavily

## Core Workflow

1. Store embeddings alongside relational identifiers.
2. Add the appropriate vector index strategy.
3. Combine vector ranking with SQL filters.
4. Use hybrid retrieval when lexical filtering still matters.
