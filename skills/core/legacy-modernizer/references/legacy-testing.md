# Legacy Testing Strategies

## Characterization Tests

Tests that document current behavior (even if buggy) before refactoring.

```python
# Legacy function with unknown behavior
def calculate_shipping_cost(order):
    """Legacy shipping calculator - behavior unclear"""
    cost = 0
    if order['weight'] > 10:
// ... (45 lines trimmed)
    return base_cost.quantize(Decimal('0.01'))

# Characterization tests should still pass
```

## Golden Master Testing

Capture output snapshots for complex legacy systems.

```python
# Legacy report generator with complex formatting
def generate_monthly_report(start_date, end_date):
    """Generates complex text report"""
    report = []
    report.append(f"Report Period: {start_date} to {end_date}")
// ... (37 lines trimmed)
    """Uses approvaltests library for easy golden master testing"""
    report = generate_monthly_report('2024-01-01', '2024-01-31')
    verify(report)  # Creates .approved file first run, compares after
```

## Snapshot Testing for APIs

```python
# Legacy API with complex responses
@app.get("/api/dashboard")
async def get_dashboard():
    # Complex aggregation logic
    return {
// ... (26 lines trimmed)
@pytest.fixture
def snapshot(snapshot):
    return snapshot.use_extension(SortedJSONExtension)
```

## Parallel Run Testing

Run old and new implementations side-by-side to compare.

```python
# Parallel run decorator
import functools
import asyncio
from typing import Callable, Any

// ... (40 lines trimmed)
@app.get("/price/{product_id}")
async def get_price(product_id: int, quantity: int = 1):
    return await calculate_price(product_id, quantity)
```

## Mutation Testing for Legacy Code

```python
# Install: pip install mutmut

# Legacy function we want to refactor
def validate_email(email):
    if '@' not in email:
// ... (28 lines trimmed)
    assert validate_email("a@b.") is False   # Dot at end
    assert validate_email(".@b.c") is False  # Dot at start
    assert validate_email("a@.com") is False # Dot after @
```

## Property-Based Testing for Legacy Logic

```python
from hypothesis import given, strategies as st

# Legacy function with unclear edge cases
def calculate_discount(price, quantity, customer_type):
    """Legacy discount logic"""
// ... (26 lines trimmed)

# Run this 100+ times with random inputs
# Hypothesis will find edge cases that break these properties
```

## Coverage-Guided Test Generation

```python
# Use coverage.py to find untested code paths
# $ pytest --cov=legacy_module --cov-report=html

# Example: Legacy function with many branches
def process_order(order):
// ... (26 lines trimmed)
    }
    result = process_order(order)
    assert result['total'] == 0  # Should handle negative total
```

## Database State Testing

```python
# Test database-dependent legacy code
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

// ... (30 lines trimmed)

    assert user is not None
    assert user['email'] == "john@example.com"
```

## Quick Reference

| Test Type | Use When | Tool |
|-----------|----------|------|
| Characterization | Unknown behavior | pytest |
| Golden Master | Complex output | approvaltests |
| Snapshot | API responses | syrupy |
| Parallel Run | Comparing implementations | Custom decorator |
| Mutation | Finding gaps | mutmut |
| Property-based | Edge cases | hypothesis |
| Coverage-guided | Untested paths | coverage.py |
