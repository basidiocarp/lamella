# Service Decomposition Patterns

## Pattern 1: By Business Capability

```python
# E-commerce example

# Order Service
class OrderService:
    """Handles order lifecycle."""
// ... (59 lines trimmed)
        )

        return ReservationResult(success=True, reservation=reservation)
```

## Pattern 2: API Gateway

```python
from fastapi import FastAPI, HTTPException, Depends
import httpx
from circuitbreaker import circuit

app = FastAPI()
// ... (53 lines trimmed)
        return {"order": order}
    except httpx.HTTPError as e:
        raise HTTPException(status_code=503, detail="Order service unavailable")
```
