# Strangler Fig Pattern

## Pattern Overview

The strangler fig pattern gradually replaces legacy systems by incrementally building new functionality around the old system, eventually "strangling" it out of existence.

```
Legacy System → Facade/Router → New System
     ↓              ↓               ↓
  Old Code    Feature Flags    Modern Code
     ↓              ↓               ↓
  Phase 1:    Route 10%       Validate New
  Phase 2:    Route 50%       Monitor Metrics
  Phase 3:    Route 100%      Remove Legacy
```

## API Gateway Strangler

```python
# Facade layer routing requests to old/new systems
from fastapi import FastAPI, Request
from typing import Literal

app = FastAPI()
// ... (29 lines trimmed)
    user_id = request.headers.get("X-User-Id", "")
    hash_val = hash(user_id) % 100
    return hash_val < percentage
```

## Service Extraction with Adapter

```python
# Legacy monolith code
class LegacyOrderService:
    def create_order(self, user_id: int, items: list) -> dict:
        # Complex legacy logic with database calls
        order = {"id": 123, "user_id": user_id, "items": items}
// ... (46 lines trimmed)
        return ModernOrderService(db, event_bus)
    else:
        return LegacyOrderAdapter(legacy_order_service)
```

## Database Strangler Pattern

```python
# Dual-write to old and new databases during migration
class DualWriteOrderRepository:
    def __init__(
        self,
        legacy_db: Connection,
// ... (32 lines trimmed)
            return await self._migrate_order(legacy_data)

        return None
```

## UI Component Strangler

```typescript
// React: Replace legacy jQuery components incrementally
import { lazy, Suspense } from 'react';

// Feature flag component wrapper
function StranglerComponent({
// ... (29 lines trimmed)
    />
  );
}
```

## Event Interception

```python
# Intercept events from legacy system
from typing import Callable
import functools

def intercept_legacy_event(event_name: str):
// ... (22 lines trimmed)
@event_bus.subscribe("user.registered")
async def modern_analytics_handler(event):
    await analytics.track_registration(event["user_id"])
```

## Migration Phases

```python
# Phase tracking and rollback
class MigrationPhase:
    def __init__(self, name: str, percentage: int, metrics: dict):
        self.name = name
        self.percentage = percentage
// ... (20 lines trimmed)
    MigrationPhase("orders_v2", 50, {"error_rate": 0.005}),  # Ramp
    MigrationPhase("orders_v2", 100, {"error_rate": 0.001}),  # Full
]
```

## Quick Reference

| Stage | Actions | Validation |
|-------|---------|------------|
| Setup | Create facade, feature flags | Smoke tests pass |
| Canary | Route 10% traffic | Error rate < 1% |
| Ramp | Route 50% traffic | Performance parity |
| Full | Route 100% traffic | All metrics green |
| Cleanup | Remove legacy code | Legacy unused 30 days |
