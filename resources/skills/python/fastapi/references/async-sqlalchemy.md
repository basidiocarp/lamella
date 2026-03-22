# Async SQLAlchemy

## Engine & Session Setup

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

engine = create_async_engine(
    settings.DATABASE_URL,
// ... (9 lines trimmed)

class Base(DeclarativeBase):
    pass
```

## Model Definition

```python
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, DateTime, func
from datetime import datetime

class User(Base):
// ... (18 lines trimmed)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    author: Mapped["User"] = relationship(back_populates="posts")
```

## Database Dependency

```python
from typing import AsyncGenerator
from fastapi import Depends

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

# Type alias for injection
DB = Annotated[AsyncSession, Depends(get_db)]
```

## CRUD Operations

```python
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload

async def get_user(db: AsyncSession, user_id: int) -> User | None:
    result = await db.execute(select(User).where(User.id == user_id))
// ... (29 lines trimmed)
async def delete_user(db: AsyncSession, user_id: int) -> bool:
    result = await db.execute(delete(User).where(User.id == user_id))
    return result.rowcount > 0
```

## Lifespan Handler

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()

app = FastAPI(lifespan=lifespan)
```

## Quick Reference

| Operation | Method |
|-----------|--------|
| Select one | `result.scalar_one_or_none()` |
| Select many | `result.scalars().all()` |
| Eager load | `.options(selectinload(...))` |
| Create | `db.add(obj)` + `await db.flush()` |
| Update | `update(Model).where(...).values(...)` |
| Delete | `delete(Model).where(...)` |
| Commit | `await db.commit()` |
| Rollback | `await db.rollback()` |
