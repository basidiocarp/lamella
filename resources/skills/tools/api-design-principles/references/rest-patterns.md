# REST API Design Patterns

Use these patterns when turning REST design principles into concrete endpoints.

## Resource Collections

Model resources with predictable collection and item endpoints:

```text
GET    /api/users
POST   /api/users
GET    /api/users/{id}
PATCH  /api/users/{id}
DELETE /api/users/{id}
```

Avoid RPC-style verbs like `/createUser` or `/deleteUser`.

## Pagination and Filtering

Keep filters and pagination in query parameters:

```text
GET /api/users?page=2&page_size=20&status=active&sort=-created_at
```

Return stable metadata so clients can navigate confidently:

```json
{
  "items": [],
  "page": 2,
  "page_size": 20,
  "total": 150
}
```

## Error Handling

Use one consistent error shape:

```json
{
  "error": "NotFound",
  "message": "User not found"
}
```

Map state properly:

- `404` missing resource
- `409` conflict
- `422` validation failure

## Practical Rule

Keep REST patterns boring and predictable. Good REST feels repetitive in a good
way because clients can guess how the next endpoint will behave.
