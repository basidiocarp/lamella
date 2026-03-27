# GraphQL Schema Design Patterns

Use this file as the routing layer for GraphQL schema design. It keeps the old
path stable while the detailed patterns live in focused references.

## Load Order

| Need | Reference |
| --- | --- |
| Type shapes, interfaces, unions, pagination, and custom scalars | `graphql-schema-shape.md` |
| Mutations, subscriptions, directives, and error-return patterns | `graphql-operations-and-errors.md` |

## Core Rules

- Keep the domain model clear before adding resolver behavior.
- Separate schema shape guidance from operation and error-shape guidance.
- Prefer focused references over one oversized GraphQL design handbook.
