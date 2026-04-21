---
name: api-design-principles
description: "Designs REST and GraphQL APIs with clear contracts and maintainable patterns."
origin: lamella
---

# API Design Principles


## Contents

- [When to Use](#when-to-use)
- [Core Concepts](#core-concepts)
- [REST Quick Patterns](#rest-quick-patterns)
- [GraphQL Quick Patterns](#graphql-quick-patterns)
- [Pagination (REST)](#pagination-rest)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Common Pitfalls](#common-pitfalls)
- [References](#references)

Design APIs that stay intuitive, scalable, and maintainable as they evolve.

## When to Use

- Designing new REST or GraphQL APIs
- Refactoring existing APIs for better usability
- Establishing API design standards for your team
- Reviewing API specifications before implementation
- Migrating between API paradigms

## Core Concepts

### RESTful Design

- **Resources are nouns** (users, orders, products), not verbs
- **HTTP methods for actions**: GET, POST, PUT, PATCH, DELETE
- **URLs represent hierarchies**: `/users/{id}/orders`

**HTTP Method Semantics:**
- `GET`: Retrieve (idempotent, safe)
- `POST`: Create
- `PUT`: Replace entire resource (idempotent)
- `PATCH`: Partial update
- `DELETE`: Remove (idempotent)

### GraphQL Design

- **Types define domain model**
- **Queries** for reading, **Mutations** for modifying
- **Single endpoint**, multiple operations
- **Strongly typed schema** with introspection

### API Versioning

```
URL:    /api/v1/users
Header: Accept: application/vnd.api+json; version=1
Query:  /api/users?version=1
```

## REST Quick Patterns

```python
# Resource endpoints
GET    /api/users              # List (paginated)
POST   /api/users              # Create
GET    /api/users/{id}         # Get one
PUT    /api/users/{id}         # Replace
PATCH  /api/users/{id}         # Update
DELETE /api/users/{id}         # Delete

# Nested resources
GET    /api/users/{id}/orders  # User's orders
```

## GraphQL Quick Patterns

```graphql
type User {
  id: ID!
  email: String!
  orders(first: Int = 20): OrderConnection!
}

type Query {
  user(id: ID!): User
  users(first: Int, after: String): UserConnection!
}

type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
}
```

## Pagination (REST)

```python
@app.get("/api/users")
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    return {
        "items": users,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size
    }
```

## Error Handling

```python
# Consistent error format
{
    "error": "NotFound",
    "message": "User not found",
    "details": {"id": "123"}
}

# Use proper status codes
200 Success, 201 Created, 204 No Content
400 Bad Request, 401 Unauthorized, 403 Forbidden
404 Not Found, 409 Conflict, 422 Unprocessable
500 Internal Error
```

## Best Practices

### REST
1. **Plural nouns** for collections (`/users` not `/user`)
2. **Stateless** - each request self-contained
3. **Proper status codes** - 2xx success, 4xx client, 5xx server
4. **Version from day one**
5. **Always paginate** large collections
6. **Rate limit** all endpoints

### GraphQL
1. **Schema first** - design before coding
2. **Use DataLoaders** - prevent N+1 queries
3. **Cursor pagination** - Relay spec
4. **Structured errors** in mutation payloads
5. **Deprecation directives** for migration

## Common Pitfalls

- **Over-fetching/under-fetching** - GraphQL solves, but needs DataLoaders
- **Breaking changes** - Always version or deprecate
- **Inconsistent errors** - Standardize format
- **No rate limits** - Vulnerable to abuse
- **Poor documentation** - Frustrates developers
- **Tight coupling** - Don't mirror database schema

## References

- [rest-patterns.md](references/rest-patterns.md) - Full REST patterns with pagination, errors, HATEOAS
- [graphql-patterns.md](references/graphql-patterns.md) - Schema design, resolvers, DataLoader
- [graphql-schema-design.md](references/graphql-schema-design.md) - GraphQL schema routing guide
- [graphql-schema-shape.md](references/graphql-schema-shape.md) - Types, interfaces, unions, pagination
- [graphql-operations-and-errors.md](references/graphql-operations-and-errors.md) - Mutations, subscriptions, directives, errors
- [rest-best-practices.md](references/rest-best-practices.md) - REST design checklist

### Additional Resources

- [Api Design Checklist](assets/api-design-checklist.md)
- [Rest Api Template](assets/rest-api-template.py)
