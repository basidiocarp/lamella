# GraphQL Design Patterns

## Pattern 1: Schema Design

```graphql
# schema.graphql

# Clear type definitions
type User {
  id: ID!
// ... (84 lines trimmed)
  field: String
  message: String!
}
```

---

## Pattern 2: Resolver Design

```python
from typing import Optional, List
from ariadne import QueryType, MutationType, ObjectType
from dataclasses import dataclass

query = QueryType()
// ... (80 lines trimmed)
            "user": None,
            "errors": [{"field": e.field, "message": e.message}]
        }
```

---

## Pattern 3: DataLoader (N+1 Problem Prevention)

```python
from aiodataloader import DataLoader
from typing import List, Optional

class UserLoader(DataLoader):
    """Batch load users by ID."""
// ... (32 lines trimmed)
            "orders_by_user": OrdersByUserLoader()
        }
    }
```

---

## GraphQL Best Practices

1. **Schema First**: Design schema before writing resolvers
2. **Avoid N+1**: Use DataLoaders for efficient data fetching
3. **Input Validation**: Validate at schema and resolver levels
4. **Error Handling**: Return structured errors in mutation payloads
5. **Pagination**: Use cursor-based pagination (Relay spec)
6. **Deprecation**: Use `@deprecated` directive for gradual migration
7. **Monitoring**: Track query complexity and execution time
