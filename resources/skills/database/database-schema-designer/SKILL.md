---
name: database-schema-designer
description: "Designs relational schemas, migrations, indexes, policies, and ERDs."
origin: lamella
---

# Database Schema Designer

Use this skill when the schema itself is the design problem.
It sits one step earlier than `postgresql`: requirements first, storage details second.

## Workflow

1. Extract entities, constraints, and user-visible workflows from the requirements.
2. Model relationships, lifecycle states, and cross-cutting concerns such as tenancy or audit trails.
3. Choose the relational shape before writing ORM or migration code.
4. Generate the target artifacts: tables, indexes, migration plan, policies, and ERD.
5. Review the design with `postgresql` or `sql-pro` for engine-specific tuning.

## What to Produce

- Table and relationship design
- Required constraints and indexes
- Migration sequencing for risky changes
- Row-level security or tenancy boundaries when needed
- ORM or migration scaffolds only after the schema is stable

## Rules

- Model the business rules first; avoid ORM-driven schemas.
- Default to normalized tables, then denormalize only for measured read paths.
- Call out soft deletes, audit fields, and versioning explicitly when they matter.
- Treat multi-tenant boundaries and RLS as first-class design decisions.
- Keep example code aligned with the actual target stack instead of emitting every ORM flavor.

## References

- `references/full-schema-examples.md`
