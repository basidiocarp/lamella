# Django to FastAPI Migration Guide

---

## When to Use This Guide

**Migrate to FastAPI when:**
- Need async/await for I/O-bound operations
- Require WebSocket or Server-Sent Events
- Want automatic OpenAPI/Swagger documentation
- Need better performance for API-heavy workloads
- Desire modern Python type hints and editor support
- Building microservices from Django monolith
- Require lower resource consumption

**DO NOT migrate when:**
- Heavy use of Django admin interface
- Extensive Django ORM model inheritance
- Complex form handling and validation
- Server-side template rendering required
- Team lacks async Python experience
- Django ecosystem plugins are critical
- Migration cost exceeds business value

---

## Concept Mapping: Django/DRF → FastAPI

| Django/DRF Concept | FastAPI Equivalent | Notes |
|-------------------|-------------------|-------|
| `models.Model` | Pydantic `BaseModel` + SQLAlchemy | Separate schema from ORM |
| `serializers.Serializer` | Pydantic `BaseModel` | Type-safe validation |
| `ModelSerializer` | Multiple Pydantic models | Create/Read/Update schemas |
| `ViewSet` | `APIRouter` + path operations | More explicit routing |
| `GenericAPIView` | Dependency injection | Function-based approach |
| `@api_view` decorator | `@router.get/post` | Built-in HTTP methods |
| `urls.py` | `APIRouter` + `app.include_router` | Nested routers |
| `settings.py` | `pydantic-settings` | Environment-based config |
| `middleware` | Middleware + dependencies | More granular control |
| `permissions` | Dependencies | Composable auth |
| `authentication` | OAuth2 + JWT dependencies | Standards-based |
| `pagination` | Query parameters + dependencies | Manual implementation |
| `filters` | Query parameters | Type-safe filtering |
| `Django ORM` | SQLAlchemy 2.0+ | Async support |
| `select_related` | `selectinload` | Eager loading |
| `prefetch_related` | `joinedload` | Join strategies |
| `pytest-django` | `pytest + httpx` | Async test client |
| `admin.py` | External (SQLAdmin, etc.) | Not built-in |

---

## Serializer → Pydantic V2 Migration

### Django REST Framework Serializer

```python
# Django DRF
from rest_framework import serializers
from .models import User, Post

class UserSerializer(serializers.ModelSerializer):
// ... (28 lines trimmed)
        post = Post.objects.create(**validated_data)
        post.tags.set(tags)
        return post
```

### FastAPI Pydantic V2 Schemas

```python
# FastAPI with Pydantic V2
from pydantic import BaseModel, EmailStr, Field, field_validator, computed_field
from datetime import datetime
from typing import Annotated

// ... (61 lines trimmed)
    author_id: int  # Side-loaded reference

    model_config = {"from_attributes": True}
```

---

## ViewSet → APIRouter Migration

### Django REST Framework ViewSet

```python
# Django DRF ViewSet
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
// ... (25 lines trimmed)
        recent_posts = self.get_queryset().order_by('-created_at')[:10]
        serializer = self.get_serializer(recent_posts, many=True)
        return Response(serializer.data)
```

### FastAPI APIRouter with Dependencies

```python
# FastAPI APIRouter
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Annotated
// ... (146 lines trimmed)
    )
    posts = result.scalars().all()
    return posts
```

---

## Django ORM → Async SQLAlchemy

### Django ORM Models

```python
# Django models
from django.db import models

class User(models.Model):
    username = models.CharField(max_length=50, unique=True)
// ... (16 lines trimmed)
    class Meta:
        db_table = 'posts'
        ordering = ['-created_at']
```

### SQLAlchemy 2.0 Async Models

```python
# SQLAlchemy 2.0 models
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Boolean, ForeignKey, Index
from datetime import datetime
from typing import List
// ... (35 lines trimmed)
    __table_args__ = (
        Index('ix_posts_created_at', 'created_at'),
    )
```

### Query Patterns: Django ORM vs SQLAlchemy

```python
# Django ORM queries
from django.db.models import Count, Q

# Simple filter
posts = Post.objects.filter(published=True)
// ... (13 lines trimmed)
user_stats = User.objects.annotate(
    post_count=Count('posts')
).filter(post_count__gte=5)
```

```python
# SQLAlchemy 2.0 async queries
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload, joinedload

# Simple filter
// ... (44 lines trimmed)
        .having(func.count(Post.id) >= 5)
    )
    return result.all()
```

---

## Authentication: SimpleJWT → FastAPI JWT

### Django SimpleJWT

```python
# Django settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
// ... (10 lines trimmed)

    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)
```

### FastAPI JWT Authentication

```python
# auth.py - FastAPI JWT implementation
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
// ... (96 lines trimmed)
@router.get("/protected")
async def protected_route(current_user: Annotated[UserModel, Depends(get_current_user)]):
    return {"message": f"Hello {current_user.username}"}
```

---

## Testing Migration

### Django/DRF Tests

```python
# Django pytest
import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User

// ... (14 lines trimmed)
    })
    assert response.status_code == 201
    assert response.data['title'] == 'Test Post'
```

### FastAPI Tests

```python
# FastAPI pytest with httpx
import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.main import app
// ... (75 lines trimmed)
    response = await client.get("/posts/", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1
```

---

## Incremental Migration Strategy

### Phase 1: Parallel API (Strangler Pattern)

Run Django and FastAPI side-by-side, migrating endpoints incrementally.

```python
# Nginx routing config
location /api/v2/ {
    proxy_pass http://fastapi:8000;
}

location /api/ {
    proxy_pass http://django:8001;
}
```

**Approach:**
1. Stand up FastAPI with shared database (read-only initially)
2. Migrate GET endpoints first (lowest risk)
3. Add write endpoints with dual-write to both systems
4. Validate data consistency
5. Switch traffic gradually (feature flags)

### Phase 2: Shared Database Migration

```python
# FastAPI with existing Django database
from sqlalchemy import MetaData

# Reflect existing Django tables
// ... (5 lines trimmed)
    __tablename__ = 'auth_user'  # Django's user table
    # Map to Django's column names
```

### Phase 3: Database Schema Modernization

After traffic migration, modernize schema:
- Remove Django-specific fields (`content_type`, `permissions`)
- Simplify table names (remove app prefixes)
- Add database-level constraints
- Optimize indexes for async queries

### Phase 4: Complete Cutover

```python
# Decommission Django
# 1. Archive Django admin usage
# 2. Export management commands to FastAPI CLI
# 3. Migrate background tasks to Celery/Dramatiq
# 4. Remove Django dependency
```

---

## Common Pitfalls

### 1. Async/Await Mistakes

**WRONG:**
```python
# Blocking call in async function
@router.get("/users")
async def get_users(db: AsyncSession):
    users = db.execute(select(User)).scalars().all()  # Missing await
    return users
```

**CORRECT:**
```python
@router.get("/users")
async def get_users(db: AsyncSession):
    result = await db.execute(select(User))  # Await async operation
    users = result.scalars().all()
    return users
```

### 2. Missing `from_attributes` (orm_mode)

**WRONG:**
```python
class UserRead(BaseModel):
    id: int
    username: str
    # Missing config - won't work with SQLAlchemy models
```

**CORRECT:**
```python
class UserRead(BaseModel):
    id: int
    username: str

    model_config = {"from_attributes": True}  # Pydantic V2
```

### 3. Session Management

**WRONG:**
```python
# Reusing session across requests
db_session = async_sessionmaker(engine)()

@router.get("/users")
async def get_users():
    return await db_session.execute(select(User))  # Session leak
```

**CORRECT:**
```python
# Dependency injection per request
async def get_db():
    async with async_sessionmaker(engine)() as session:
        yield session
        await session.commit()

@router.get("/users")
async def get_users(db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(User))
    return result.scalars().all()
```

### 4. Relationship Loading

**WRONG:**
```python
# Lazy loading in async (causes errors)
user = await db.get(User, user_id)
posts = user.posts  # Error: lazy loading not supported in async
```

**CORRECT:**
```python
# Eager loading with selectinload
result = await db.execute(
    select(User).options(selectinload(User.posts)).where(User.id == user_id)
)
user = result.scalar_one()
posts = user.posts  # Already loaded
```

### 5. Transaction Handling

**WRONG:**
```python
# Auto-commit not configured
@router.post("/users")
async def create_user(user: UserCreate, db: AsyncSession):
    db_user = User(**user.dict())
    db.add(db_user)
    # Missing commit - changes lost
    return db_user
```

**CORRECT:**
```python
@router.post("/users")
async def create_user(user: UserCreate, db: AsyncSession):
    db_user = User(**user.model_dump())
    db.add(db_user)
    await db.commit()  # Explicit commit
    await db.refresh(db_user)  # Refresh to get DB-generated fields
    return db_user
```

---

## Cross-Reference

For comprehensive migration strategies and modernization patterns:
- **Legacy Modernizer**: See the [`legacy-modernizer`](../../../core/legacy-modernizer/) skill and its [`migration-strategies.md`](../../../core/legacy-modernizer/references/migration-strategies.md) reference
  - Strangler pattern implementation
  - Feature flag strategies
  - Rollback procedures
  - Data migration pipelines

---

## Migration Checklist

**Pre-Migration:**
- [ ] Async readiness assessment (I/O bound workload?)
- [ ] Team async Python experience validated
- [ ] Database compatibility verified (async drivers available)
- [ ] Admin interface replacement identified
- [ ] Migration timeline approved (6-12 months realistic)

**During Migration:**
- [ ] Parallel deployment configured
- [ ] Monitoring and alerting set up
- [ ] Load testing completed
- [ ] Data consistency validation automated
- [ ] Rollback procedure tested

**Post-Migration:**
- [ ] Django dependencies removed
- [ ] Documentation updated
- [ ] Team training completed
- [ ] Performance gains measured
- [ ] Cost savings validated

---

**Key Takeaway:** Migrate incrementally. Start with read-heavy endpoints, validate thoroughly, then gradually move write operations. Always maintain rollback capability.
