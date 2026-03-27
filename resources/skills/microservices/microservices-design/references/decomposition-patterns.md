# Service Decomposition Patterns

## Pattern 1: By Business Capability

```python
class OrderService:
    """Owns order lifecycle and orchestration."""

    async def create_order(self, order_data: dict) -> dict:
        order = await self.repository.create(order_data)
        await self.event_bus.publish("order.created", {"order_id": order["id"]})
        return order


class InventoryService:
    """Owns stock reservation and release."""

    async def reserve_stock(self, product_id: str, quantity: int) -> dict:
        reservation = await self.repository.reserve(product_id, quantity)
        return {"success": True, "reservation": reservation}
```

Use business-capability decomposition when teams, workflows, and data ownership
line up around real domain boundaries such as orders, inventory, or billing.

## Pattern 2: API Gateway

```python
import httpx
from fastapi import FastAPI, HTTPException

app = FastAPI()


@app.get("/orders/{order_id}")
async def get_order(order_id: str):
    async with httpx.AsyncClient(timeout=3.0) as client:
        try:
            order = (await client.get(f"http://orders:8001/orders/{order_id}")).json()
            customer = (
                await client.get(f"http://customers:8002/customers/{order['customer_id']}")
            ).json()
            return {"order": order, "customer": customer}
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=503, detail="Downstream service unavailable") from exc
```

Use an API gateway when clients need one stable entrypoint, response shaping, or
cross-cutting controls like auth, rate limiting, and request aggregation.
