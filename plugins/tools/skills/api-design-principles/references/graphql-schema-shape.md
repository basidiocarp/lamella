# GraphQL Schema Shape

This reference covers the type-system choices that determine whether a GraphQL
schema stays readable as it grows.

## Modular Schema Structure

```graphql
# user.graphql
type User {
  id: ID!
  email: String!
  name: String!
}

extend type Query {
  user(id: ID!): User
}

# post.graphql
type Post {
  id: ID!
  title: String!
  author: User!
}

extend type Query {
  post(id: ID!): Post
}
```

## Nullability

```graphql
type User {
  id: ID!
  email: String!
  phone: String
  posts: [Post!]!
  tags: [String!]
}
```

Be deliberate about nullability. `ID!` means “always present.” `[Post!]!` means
“list always present, entries never null.”

## Interfaces and Unions

```graphql
interface Node {
  id: ID!
  createdAt: DateTime!
}

type User implements Node {
  id: ID!
  createdAt: DateTime!
  email: String!
}

union SearchResult = User | Post | Comment

type Query {
  node(id: ID!): Node
  search(query: String!): [SearchResult!]!
}
```

Use interfaces for shared shape and unions for heterogeneous search-like
results.

## Pagination

Relay-style cursor pagination is the safer default for evolving APIs.

```graphql
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  cursor: String!
  node: User!
}

type Query {
  users(first: Int = 20, after: String): UserConnection!
}
```

Offset pagination is fine for simpler internal APIs when the tradeoffs are
acceptable.

## Field Arguments and Filtering

```graphql
type Query {
  posts(
    first: Int = 20
    after: String
    authorId: ID
    search: String
    sort: SortDirection = DESC
  ): PostConnection!
}

enum SortDirection {
  ASC
  DESC
}
```

Keep arguments coherent and avoid hiding too many unrelated filters in one
field.

## Custom Scalars

```graphql
scalar DateTime
scalar Email
scalar URL
scalar JSON
scalar Money

type Product {
  price: Money!
}
```

Use custom scalars only when you can enforce or document their semantics.

## Rules

- Model the domain first, then optimize resolver behavior second.
- Default to cursor pagination for public or growth-facing APIs.
- Use interfaces and unions where they simplify the mental model, not just to
  be flexible.
