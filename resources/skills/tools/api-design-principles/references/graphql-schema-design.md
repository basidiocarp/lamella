# GraphQL Schema Design Patterns

## Schema Organization

### Modular Schema Structure

```graphql
# user.graphql
type User {
  id: ID!
  email: String!
  name: String!
// ... (20 lines trimmed)
extend type Query {
  post(id: ID!): Post
}
```

## Type Design Patterns

### 1. Non-Null Types

```graphql
type User {
  id: ID! # Always required
  email: String! # Required
  phone: String # Optional (nullable)
  posts: [Post!]! # Non-null array of non-null posts
  tags: [String!] # Nullable array of non-null strings
}
```

### 2. Interfaces for Polymorphism

```graphql
interface Node {
  id: ID!
  createdAt: DateTime!
}

// ... (12 lines trimmed)
type Query {
  node(id: ID!): Node
}
```

### 3. Unions for Heterogeneous Results

```graphql
union SearchResult = User | Post | Comment

type Query {
  search(query: String!): [SearchResult!]!
}
// ... (17 lines trimmed)
    }
  }
}
```

### 4. Input Types

```graphql
input CreateUserInput {
  email: String!
  name: String!
  password: String!
  profileInput: ProfileInput
// ... (11 lines trimmed)
  name: String
  profileInput: ProfileInput
}
```

## Pagination Patterns

### Relay Cursor Pagination (Recommended)

```graphql
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
// ... (30 lines trimmed)
    }
  }
}
```

### Offset Pagination (Simpler)

```graphql
type UserList {
  items: [User!]!
  total: Int!
  page: Int!
  pageSize: Int!
}

type Query {
  users(page: Int = 1, pageSize: Int = 20): UserList!
}
```

## Mutation Design Patterns

### 1. Input/Payload Pattern

```graphql
input CreatePostInput {
  title: String!
  content: String!
  tags: [String!]
}
// ... (13 lines trimmed)
type Mutation {
  createPost(input: CreatePostInput!): CreatePostPayload!
}
```

### 2. Optimistic Response Support

```graphql
type UpdateUserPayload {
  user: User
  clientMutationId: String
  errors: [Error!]
// ... (9 lines trimmed)
  updateUser(input: UpdateUserInput!): UpdateUserPayload!
}
```

### 3. Batch Mutations

```graphql
input BatchCreateUserInput {
  users: [CreateUserInput!]!
}

type BatchCreateUserPayload {
// ... (11 lines trimmed)
type Mutation {
  batchCreateUsers(input: BatchCreateUserInput!): BatchCreateUserPayload!
}
```

## Field Design

### Arguments and Filtering

```graphql
type Query {
  posts(
    # Pagination
    first: Int = 20
    after: String
// ... (28 lines trimmed)
  ASC
  DESC
}
```

### Computed Fields

```graphql
type User {
  firstName: String!
  lastName: String!
  fullName: String! # Computed in resolver
// ... (7 lines trimmed)
  isLikedByViewer: Boolean! # Context-dependent
}
```

## Subscriptions

```graphql
type Subscription {
  postAdded: Post!

  postUpdated(postId: ID!): Post!

// ... (16 lines trimmed)
    }
  }
}
```

## Custom Scalars

```graphql
scalar DateTime
scalar Email
scalar URL
scalar JSON
scalar Money
// ... (8 lines trimmed)
type Product {
  price: Money!
}
```

## Directives

### Built-in Directives

```graphql
type User {
  name: String!
  email: String! @deprecated(reason: "Use emails field instead")
  emails: [String!]!

// ... (10 lines trimmed)
    }
  }
}
```

### Custom Directives

```graphql
directive @auth(requires: Role = USER) on FIELD_DEFINITION

enum Role {
  USER
// ... (6 lines trimmed)
  updateProfile(input: ProfileInput!): User! @auth
}
```

## Error Handling

### Union Error Pattern

```graphql
type User {
  id: ID!
  email: String!
}

// ... (34 lines trimmed)
    }
  }
}
```

### Errors in Payload

```graphql
type CreateUserPayload {
  user: User
  errors: [Error!]
  success: Boolean!
}
// ... (10 lines trimmed)
  NOT_FOUND
  INTERNAL_ERROR
}
```

## N+1 Query Problem Solutions

### DataLoader Pattern

```python
from aiodataloader import DataLoader

class PostLoader(DataLoader):
    async def batch_load_fn(self, post_ids):
// ... (7 lines trimmed)
    loader = info.context["loaders"]["post"]
    return await loader.load_many(user["post_ids"])
```

### Query Depth Limiting

```python
from graphql import GraphQLError

def depth_limit_validator(max_depth: int):
    def validate(context, node, ancestors):
        depth = len(ancestors)
        if depth > max_depth:
            raise GraphQLError(
                f"Query depth {depth} exceeds maximum {max_depth}"
            )
    return validate
```

### Query Complexity Analysis

```python
def complexity_limit_validator(max_complexity: int):
    def calculate_complexity(node):
        # Each field = 1, lists multiply
        complexity = 1
        if is_list_field(node):
            complexity *= get_list_size_arg(node)
        return complexity

    return validate_complexity
```

## Schema Versioning

### Field Deprecation

```graphql
type User {
  name: String! @deprecated(reason: "Use firstName and lastName")
  firstName: String!
  lastName: String!
}
```

### Schema Evolution

```graphql
# v1 - Initial
type User {
  name: String!
}

// ... (10 lines trimmed)
  lastName: String!
  email: String
}
```

## Best Practices Summary

1. **Nullable vs Non-Null**: Start nullable, make non-null when guaranteed
2. **Input Types**: Always use input types for mutations
3. **Payload Pattern**: Return errors in mutation payloads
4. **Pagination**: Use cursor-based for infinite scroll, offset for simple cases
5. **Naming**: Use camelCase for fields, PascalCase for types
6. **Deprecation**: Use `@deprecated` instead of removing fields
7. **DataLoaders**: Always use for relationships to prevent N+1
8. **Complexity Limits**: Protect against expensive queries
9. **Custom Scalars**: Use for domain-specific types (Email, DateTime)
10. **Documentation**: Document all fields with descriptions
