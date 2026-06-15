# Code-First OpenAPI Examples

Use code-first generation when the framework already exposes a reliable schema
surface from types and route declarations.

## FastAPI

FastAPI derives OpenAPI from models and route decorators:

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    id: str
    email: str

@app.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    return User(id=user_id, email="user@example.com")
```

## tsoa / TypeScript

Decorator-driven TypeScript frameworks can emit routes and specs together:

```typescript
@Route("users")
export class UsersController extends Controller {
  @Get("{userId}")
  public async getUser(userId: string): Promise<User> {
    return getUser(userId);
  }
}
```

## Practical Rule

Code-first generation works well when the framework metadata is trustworthy. If
the generated spec keeps drifting from the intended public contract, move the
boundary toward design-first review instead of piling on patch scripts.
