# GraphQL Operations and Error Patterns

This reference covers mutation shape, subscriptions, directives, and the
patterns that keep GraphQL responses explicit under failure.

## Input and Payload Mutations

```graphql
input CreatePostInput {
  title: String!
  content: String!
  tags: [String!]
}

type CreatePostPayload {
  post: Post
  errors: [Error!]
}

type Mutation {
  createPost(input: CreatePostInput!): CreatePostPayload!
}
```

The input/payload pattern keeps mutation arguments stable and leaves room for
structured errors and metadata.

## Optimistic and Client-Correlated Mutations

```graphql
input UpdateUserInput {
  id: ID!
  name: String
  clientMutationId: String
}

type UpdateUserPayload {
  user: User
  clientMutationId: String
  errors: [Error!]
}
```

Use `clientMutationId` only when the client flow truly benefits from it.

## Batch Mutations

```graphql
input BatchCreateUserInput {
  users: [CreateUserInput!]!
}

type BatchCreateUserPayload {
  users: [User!]!
  errors: [Error!]
}

type Mutation {
  batchCreateUsers(input: BatchCreateUserInput!): BatchCreateUserPayload!
}
```

Batch mutations are useful, but they should still expose partial failure clearly.

## Computed and Contextual Fields

```graphql
type User {
  firstName: String!
  lastName: String!
  fullName: String!
  isLikedByViewer: Boolean!
}
```

Computed fields are fine when their semantics are stable and documented.

## Subscriptions

```graphql
type Subscription {
  postAdded: Post!
  postUpdated(postId: ID!): Post!
}
```

Keep subscription payloads simple. Avoid overloading them with mutation-like
side effects.

## Directives

Built-in and custom directives should make intent visible:

```graphql
type User {
  email: String! @deprecated(reason: "Use emails field instead")
  emails: [String!]!
}
```

```graphql
directive @auth(requires: Role = USER) on FIELD_DEFINITION

enum Role {
  USER
  ADMIN
}

type Mutation {
  updateProfile(input: ProfileInput!): User! @auth
}
```

## Error Patterns

Payload errors:

```graphql
type Error {
  code: ErrorCode!
  field: String
  message: String!
}

type CreateUserPayload {
  user: User
  errors: [Error!]
  success: Boolean!
}
```

Alternative union-style error responses are acceptable, but use them
consistently if you choose them.

## Rules

- Use input/payload mutation shapes for anything non-trivial.
- Return structured errors instead of free-form strings.
- Keep subscription and directive design explicit and documented.
