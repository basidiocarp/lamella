# FastAPI Authentication

Keep FastAPI authentication focused on request flow, token handling, and
dependency boundaries.

## Core Pieces

- `OAuth2PasswordBearer` for bearer-token extraction
- password hashing with a maintained library and sensible work factor
- short-lived access tokens and longer-lived refresh tokens
- `Depends(...)` chains for current-user and role checks

## Rules

- keep token verification and user loading separate
- centralize current-user dependency logic
- fail closed on invalid or expired tokens
- avoid expanding this into a general security handbook

## Typical Flow

1. authenticate credentials
2. issue access and refresh tokens
3. decode bearer token in a dependency
4. load current user
5. apply role or scope checks close to the route
