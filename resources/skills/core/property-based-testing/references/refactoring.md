# Refactoring for Property-Based Testing

Identify code that could be refactored to enable or improve property-based testing.

## Quick Reference

| Pattern | Problem | Solution | Properties Enabled |
|---------|---------|----------|-------------------|
| I/O mixed with logic | Hard to test without mocks | Extract pure core | Multiple |
| Encode without decode | No roundtrip possible | Add inverse operation | Roundtrip |
| Hardcoded config | Edge cases hard to reach | Inject dependencies | Invariants |
| In-place mutation | Hard to compare before and after | Return new value | Comparison properties |

## Refactoring Patterns

### 1. Extract Pure Core from Impure Functions

```python
# BEFORE
def process_order(order_id: str) -> None:
    order = db.fetch(order_id)
    discount = calculate_discount(order)
    total = apply_discount(order, discount)
    db.save(order_id, total)

# AFTER
def calculate_order_total(order: Order, rules: DiscountRules) -> Money:
    discount = calculate_discount(order, rules)
    return apply_discount(order, discount)

def process_order(order_id: str) -> None:
    order = db.fetch(order_id)
    total = calculate_order_total(order, get_discount_rules())
    db.save(order_id, total)
```

### 2. Add Missing Inverse Operations

If you can encode, serialize, or render, consider whether you should also decode, parse, or invert.

### 3. Replace Hardcoded Dependencies

Inject config or collaborators so the test can explore boundary cases.

### 4. Return Values Instead of Mutating

Returning new values is usually easier to test than in-place mutation.

## Prioritization

Prefer refactors that:
1. enable strong properties such as roundtrip
2. require low effort
3. carry low regression risk
