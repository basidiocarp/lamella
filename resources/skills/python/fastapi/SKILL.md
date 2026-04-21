---
name: fastapi
description: "Applies FastAPI best practices and conventions for APIs and Pydantic models."
origin: lamella
---

# FastAPI

Use this skill when building or modernizing FastAPI services. Keep the main skill focused on current default patterns and route detailed implementation topics into the references.

## When to Use

- Creating or refactoring FastAPI endpoints
- Updating Pydantic and dependency-injection patterns
- Designing router layout and response models
- Choosing between sync and async path operations
- Adding authentication, testing, or streaming responses

## Core Conventions

1. Prefer `Annotated` for parameters and dependencies.
2. Use explicit return types or `response_model` to filter and document output.
3. Keep one HTTP operation per function.
4. Put router-level prefixes, tags, and shared dependencies on the router.
5. Use async handlers only when the underlying work is actually async-safe.

## Minimal Pattern

```python
from typing import Annotated

from fastapi import APIRouter, Depends, FastAPI, Query
from pydantic import BaseModel

app = FastAPI()
router = APIRouter(prefix="/items", tags=["items"])

class Item(BaseModel):
    name: str

async def get_current_user() -> dict:
    return {"id": "user-1"}

CurrentUser = Annotated[dict, Depends(get_current_user)]

@router.get("/", response_model=list[Item])
async def list_items(
    current_user: CurrentUser,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> list[Item]:
    return [Item(name="example")]

app.include_router(router)
```

## References

- [references/dependencies.md](references/dependencies.md)
- [references/endpoints-routing.md](references/endpoints-routing.md)
- [references/pydantic-v2.md](references/pydantic-v2.md)
- [references/streaming.md](references/streaming.md)
- [references/testing-async.md](references/testing-async.md)
- [references/authentication.md](references/authentication.md)
- [references/auth-testing-and-rollout.md](references/auth-testing-and-rollout.md)
- [references/async-sqlalchemy.md](references/async-sqlalchemy.md)
- [references/other-tools.md](references/other-tools.md)
- [references/migration-from-django.md](references/migration-from-django.md)
- [references/orm-and-query-migration.md](references/orm-and-query-migration.md)
- [references/schema-and-routing-migration.md](references/schema-and-routing-migration.md)
