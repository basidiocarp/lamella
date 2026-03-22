# GraphQL Schema Design

## Object Types

```graphql
"""
User account with authentication and profile information.
All users must have a unique email address.
"""
type User {
// ... (29 lines trimmed)
  tags: [Tag!]!
  comments(first: Int, after: String): CommentConnection!
}
```

## Interfaces

```graphql
"""
Common interface for all content that can be timestamped
"""
interface Timestamped {
  id: ID!
// ... (35 lines trimmed)
type Query {
  search(query: String!): [Searchable!]!
}
```

## Union Types

```graphql
"""
Result of a content search - can be Article, Video, or Podcast
"""
union SearchResult = Article | Video | Podcast

// ... (20 lines trimmed)
  searchContent(query: String!): [SearchResult!]!
  notifications(first: Int): [Notification!]!
}
```

## Enums

```graphql
"""
Post publication status
"""
enum PostStatus {
  DRAFT
// ... (26 lines trimmed)
    orderBy: SortOrder = DESC
  ): [Post!]!
}
```

## Input Types

```graphql
"""
Input for creating a new user
"""
input CreateUserInput {
  email: String!
// ... (39 lines trimmed)
type Query {
  posts(filter: PostFilterInput, first: Int, after: String): PostConnection!
}
```

## Custom Scalars

```graphql
"""
ISO 8601 date-time string
"""
scalar DateTime

// ... (25 lines trimmed)
  metadata: JSON
  age: PositiveInt
}
```

## Pagination Patterns

```graphql
"""
Cursor-based pagination (Relay specification)
"""
type PostConnection {
  edges: [PostEdge!]!
// ... (21 lines trimmed)
    before: String
  ): PostConnection!
}
```

## Nullable vs Non-Nullable Best Practices

```graphql
type User {
  # Non-nullable: guaranteed to exist
  id: ID!
  email: String!
  createdAt: DateTime!
// ... (26 lines trimmed)
  # Non-null: guaranteed to return result or error
  currentUser: User!
}
```

## Field Deprecation

```graphql
type User {
  id: ID!
  email: String!

  # Deprecated field with migration path
  name: String @deprecated(reason: "Use 'username' instead")
  username: String

  # Deprecated with specific date
  legacyId: String @deprecated(
    reason: "Migrating to UUID. Will be removed 2025-06-01"
  )
}
```

## Schema Documentation

```graphql
"""
User represents an authenticated account in the system.
Users can create posts, comments, and interact with content.

Example query:
```
query GetUser {
  user(id: "123") {
    email
    username
    posts(first: 10) {
      edges {
        node {
          title
        }
      }
    }
  }
}
```
"""
type User {
  "Unique identifier for the user"
  id: ID!

  "Email address (must be unique across all users)"
  email: String!

  "Optional display name (defaults to email if not set)"
  username: String
}
```

## Design Principles

1. **Nullable Fields**: Make fields nullable by default unless guaranteed to exist
2. **List Fields**: Use `[Type!]!` for lists that always exist with non-null items
3. **Documentation**: Document all types and fields with descriptions
4. **Naming**: Use camelCase for fields, PascalCase for types
5. **Interfaces**: Use interfaces for shared fields across types
6. **Unions**: Use unions for polymorphic return types
7. **Input Types**: Create separate input types for mutations
8. **Scalars**: Use custom scalars for domain-specific types
9. **Deprecation**: Mark deprecated fields, provide migration path
10. **Examples**: Include example queries in documentation
