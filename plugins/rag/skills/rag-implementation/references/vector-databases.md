# Vector Databases

Use this page as the routing layer for vector store selection and operations.

## Load Order

| Need | Reference |
| --- | --- |
| choosing a database by operational fit | `vector-db-selection.md` |
| database-specific setup and hosting trade-offs | `managed-and-self-hosted-vector-dbs.md` |
| indexing, tuning, and multi-tenancy | `vector-db-tuning-and-tenancy.md` |

## Core Rules

- choose the store based on scale, ops model, and filtering needs
- separate prototyping choices from production choices deliberately
- treat indexing and tenant isolation as first-class design decisions
