# Migration Strategies

## Database Migration Strategy

### Dual-Write Pattern

```python
# Phase 1: Dual write to both databases
class DualWriteUserRepository:
    def __init__(self, legacy_db, modern_db: AsyncSession):
        self.legacy = legacy_db
        self.modern = modern_db
// ... (51 lines trimmed)
    else:
        # Continue dual-write during migration
        return await self._create_dual_write(user_data)
```

### Schema Evolution

```python
# Expand-Contract pattern for schema changes
# Step 1: EXPAND - Add new column (nullable or default value)
"""
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
"""
// ... (30 lines trimmed)
"""
ALTER TABLE users DROP COLUMN is_confirmed;
"""
```

## API Versioning Migration

```python
# Version 1: Legacy API
@app.get("/api/users/{user_id}")
async def get_user_v1(user_id: int):
    user = await users.get(user_id)
    return {
// ... (38 lines trimmed)
# Deprecation headers
response.headers["X-API-Deprecation"] = "V1 deprecated, migrate to V2"
response.headers["X-API-Sunset"] = "2024-12-31"
```

## Framework Migration (Flask to FastAPI)

```python
# Original Flask code
from flask import Flask, request, jsonify

flask_app = Flask(__name__)

// ... (53 lines trimmed)

# Step 4: Gradually migrate endpoints, update routing
# Step 5: Shutdown Flask once all endpoints migrated
```

## Frontend Migration (jQuery to React)

```javascript
// Step 1: Load both frameworks
// index.html
<script src="jquery.min.js"></script>
<script src="legacy-app.js"></script>
<div id="react-root"></div>
// ... (68 lines trimmed)

  return value;
}
```

## Microservices Extraction

```python
# Monolith with tightly coupled modules
class MonolithApp:
    def process_order(self, order_data):
        # Payment logic
        payment = self.charge_card(order_data['card'])
// ... (58 lines trimmed)
async def process_order(order_data):
    # Fire and forget - services are autonomous
    await event_bus.publish("order.created", order_data)
```

## Language Version Upgrade (Python 2 to 3)

```python
# Use six library for compatibility during migration
import six

# Works in both Python 2 and 3
if six.PY2:
// ... (20 lines trimmed)

# Python 3
user_name = str(raw_name)
```

## Quick Reference

| Migration Type | Strategy | Key Considerations |
|----------------|----------|-------------------|
| Database | Dual-write, lazy migration | Data consistency, rollback |
| API | Versioning, content negotiation | Client migration timeline |
| Framework | Proxy, parallel run | Performance overhead |
| Frontend | Incremental, shared state | Bundle size, compatibility |
| Microservices | Extract, events | Network reliability, data |
| Language | Compatibility layer | Dependency updates |
