# GraphQL Schema Design

Use this as the fast schema-shape checklist for GraphQL APIs.

## Object Types

Use object types for concrete entities and keep fields coherent around one
domain concept.

```graphql
type User {
  id: ID!
  email: String!
  username: String
  posts(first: Int, after: String): PostConnection!
}
```

## Interfaces and Unions

Use interfaces when several types share a stable field contract. Use unions when
the result can be one of several unrelated shapes.

```graphql
interface Node {
  id: ID!
}

union SearchResult = Article | Video | Podcast
```

## Enums, Inputs, and Scalars

Prefer enums over free-form strings for bounded states. Use dedicated input
types for mutations. Introduce custom scalars only when the semantic gain is
real.

```graphql
enum PostStatus {
  DRAFT
  PUBLISHED
}

input CreateUserInput {
  email: String!
  username: String
}

scalar DateTime
```

## Pagination and Nullability

Use cursor pagination for growing collections and be deliberate about nulls.

```graphql
type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
}
```

Rules:

- default to nullable unless the contract truly guarantees a value
- prefer `[Type!]!` for lists that always exist
- make failure explicit rather than hiding it behind accidental nullability

## Deprecation and Documentation

Deprecate fields with a concrete migration path.

```graphql
type User {
  name: String @deprecated(reason: "Use `username` instead")
  username: String
}
```

Document types and fields with descriptions when the behavior is not obvious
from the name alone.

## Practical Rules

- Use PascalCase for types and camelCase for fields.
- Keep mutation inputs separate from output types.
- Do not mirror the database schema blindly.
- Design schema boundaries around client tasks, not ORM convenience.
