# Refactoring Patterns

## Branch by Abstraction

Enables large refactorings to happen incrementally without breaking existing code.

```python
# Step 1: Create abstraction
from abc import ABC, abstractmethod

class PaymentProcessor(ABC):
    @abstractmethod
// ... (37 lines trimmed)
    if feature_flags.is_enabled("stripe_payments"):
        return StripePaymentProcessor(stripe_client)
    return LegacyPaymentProcessor()
```

## Extract Service Pattern

```python
# Before: Monolithic order processing
class OrderController:
    def create_order(self, user_id, items):
        # Validation
        if not items:
// ... (64 lines trimmed)
        if user.is_premium:
            return subtotal * Decimal("0.1")  # 10% off
        return Decimal("0")
```

## Adapter Pattern for Legacy Integration

```python
# Legacy system with incompatible interface
class LegacyInventorySystem:
    def GetItemCount(self, itemCode: str) -> int:
        """Legacy method with different naming convention"""
        pass
// ... (37 lines trimmed)
            stock = await self.inventory.get_stock_level(item.sku)
            if stock >= item.quantity:
                await self.inventory.reduce_stock(item.sku, item.quantity)
```

## Facade Pattern for Simplification

```python
# Complex legacy subsystems
class LegacyAuthSystem:
    def authenticate_user(self, username, password): pass
    def check_permissions(self, user_id, resource): pass
    def get_user_roles(self, user_id): pass
// ... (66 lines trimmed)
    if session_id:
        return {"session_id": session_id}
    raise HTTPException(401, "Invalid credentials")
```

## Replace Algorithm Pattern

```python
# Legacy algorithm with poor performance
def legacy_search_products(query: str, products: list) -> list:
    """O(n) linear search through all products"""
    results = []
    for product in products:
// ... (49 lines trimmed)
    if feature_flags.is_enabled("elasticsearch_search"):
        return ElasticsearchProductSearch(es_client)
    return LegacyProductSearch(product_cache)
```

## Introduce Repository Pattern

```python
# Legacy data access scattered throughout code
class OrderController:
    def get_order(self, order_id):
        # Direct SQL in controller
        result = db.execute("SELECT * FROM orders WHERE id = ?", order_id)
// ... (50 lines trimmed)
        if not order:
            raise HTTPException(404)
        return order
```

## Quick Reference

| Pattern | Use When | Benefit |
|---------|----------|---------|
| Branch by Abstraction | Large refactoring needed | Incremental migration |
| Extract Service | Class doing too much | Single responsibility |
| Adapter | Legacy interface incompatible | Bridge old and new |
| Facade | Complex subsystem | Simplified interface |
| Replace Algorithm | Performance/maintainability | Swap implementations |
| Repository | Data access scattered | Centralized data logic |
