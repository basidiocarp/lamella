# Code-First OpenAPI Generation

Generate OpenAPI specs automatically from annotated code using framework-specific decorators and type systems.

## Python/FastAPI

FastAPI generates OpenAPI specs automatically from Pydantic models and endpoint decorators.

```python
from fastapi import FastAPI, HTTPException, Query, Path, Depends
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID
// ... (175 lines trimmed)
if __name__ == "__main__":
    import json
    print(json.dumps(app.openapi(), indent=2))
```

## TypeScript/Express with tsoa

tsoa generates OpenAPI specs from TypeScript decorators and interfaces.

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
// ... (170 lines trimmed)
    this.setStatus(204);
  }
}
```

### tsoa Configuration

```json
// tsoa.json
{
  "entryFile": "src/index.ts",
  "noImplicitAdditionalProperties": "throw-on-extras",
  "controllerPathGlobs": ["src/**/*Controller.ts"],
// ... (12 lines trimmed)
    "routesDir": "build"
  }
}
```

### Generate Spec

```bash
# Generate OpenAPI spec and routes
npx tsoa spec-and-routes
```
