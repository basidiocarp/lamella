# REST API Design Patterns

## Pattern 1: Resource Collection Design

```python
# Good: Resource-oriented endpoints
GET    /api/users              # List users (with pagination)
POST   /api/users              # Create user
GET    /api/users/{id}         # Get specific user
PUT    /api/users/{id}         # Replace user
// ... (8 lines trimmed)
POST   /api/createUser
POST   /api/getUserById
POST   /api/deleteUser
```

---

## Pattern 2: Pagination and Filtering

```python
from typing import List, Optional
from pydantic import BaseModel, Field

class PaginationParams(BaseModel):
    page: int = Field(1, ge=1, description="Page number")
// ... (48 lines trimmed)
        page_size=page_size,
        pages=(total + page_size - 1) // page_size
    )
```

---

## Pattern 3: Error Handling and Status Codes

```python
from fastapi import HTTPException, status
from pydantic import BaseModel

class ErrorResponse(BaseModel):
    error: str
// ... (48 lines trimmed)
    if not user:
        raise_not_found("User", user_id)
    return user
```

---

## Pattern 4: HATEOAS (Hypermedia as the Engine of Application State)

```python
class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    _links: dict
// ... (17 lines trimmed)
                }
            }
        )
```

---

## REST Best Practices

1. **Consistent Naming**: Use plural nouns for collections (`/users`, not `/user`)
2. **Stateless**: Each request contains all necessary information
3. **Use HTTP Status Codes Correctly**: 2xx success, 4xx client errors, 5xx server errors
4. **Version Your API**: Plan for breaking changes from day one
5. **Pagination**: Always paginate large collections
6. **Rate Limiting**: Protect your API with rate limits
7. **Documentation**: Use OpenAPI/Swagger for interactive docs
