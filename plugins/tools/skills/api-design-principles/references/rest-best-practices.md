# REST API Best Practices

Use this as the quick REST checklist when designing or reviewing an API.

## URL Design

Prefer nouns and shallow hierarchies.

```text
GET  /api/users
GET  /api/users/{id}
GET  /api/users/{id}/orders
GET  /api/orders/{id}
```

Avoid verbs and deep nesting:

```text
GET  /api/getUser
POST /api/createOrder
GET  /api/users/{id}/orders/{orderId}/items/{itemId}/reviews
```

## Methods and Status Codes

Use method semantics consistently:

```text
GET    /api/users/{id}   -> 200 or 404
POST   /api/users        -> 201 with Location header
PUT    /api/users/{id}   -> 200 for full replacement
PATCH  /api/users/{id}   -> 200 for partial update
DELETE /api/users/{id}   -> 204 when deleted
```

Use `422` for validation failures and `409` for state conflicts.

## Query Parameters

Put filters, sorting, and pagination in query parameters:

```text
GET /api/users?status=active&role=admin
GET /api/users?sort=-created_at
GET /api/users?fields=id,name,email
GET /api/users?page=2&page_size=20
```

Use cursor pagination for large or append-heavy datasets:

```json
{
  "items": [],
  "next_cursor": "eyJpZCI6MTQzfQ",
  "has_more": true
}
```

## Versioning

Pick one versioning strategy and stick to it. URL versioning is usually the
least surprising:

```text
/api/v1/users
/api/v2/users
```

## Rate Limits and Auth

Expose rate-limit headers and return `429` with `Retry-After` when necessary.
Use `401` for missing or invalid credentials and `403` for valid credentials
without permission.

## Error Shape

Keep one consistent error contract:

```json
{
  "error": "ValidationError",
  "message": "Email is required",
  "details": {
    "field": "email"
  }
}
```

## Practical Rules

- Design endpoints around resources, not controller methods.
- Always document pagination, filtering, and sort behavior.
- Do not use one-off error formats per endpoint.
- Version before you need it, not after a breaking change ships.
