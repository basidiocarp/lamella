# Authentication

## OAuth2 Password Flow

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")
// ... (14 lines trimmed)
        access_token=create_access_token(sub=str(user.id)),
        token_type="bearer",
    )
```

## JWT Token Creation

```python
from datetime import datetime, timedelta, UTC
from jose import JWTError, jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
// ... (22 lines trimmed)
        settings.SECRET_KEY,
        algorithm="HS256",
    )
```

## Get Current User

```python
async def get_current_user(
    db: DB,
    token: Annotated[str, Depends(oauth2_scheme)],
) -> User:
    credentials_exception = HTTPException(
// ... (15 lines trimmed)
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]
```

## Role-Based Access

```python
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
// ... (16 lines trimmed)
    admin: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
) -> None:
    ...
```

## Refresh Token

```python
@router.post("/refresh", response_model=Token)
async def refresh_token(
    db: DB,
    refresh_token: str = Body(..., embed=True),
) -> Token:
// ... (13 lines trimmed)
        access_token=create_access_token(sub=str(user.id)),
        token_type="bearer",
    )
```

## Quick Reference

| Component | Purpose |
|-----------|---------|
| `OAuth2PasswordBearer` | Extract token from header |
| `OAuth2PasswordRequestForm` | Login form data |
| `jwt.encode()` | Create JWT |
| `jwt.decode()` | Verify JWT |
| `pwd_context.hash()` | Hash password |
| `pwd_context.verify()` | Check password |
| `Depends(get_current_user)` | Require auth |
| `require_roles()` | Role-based access |
