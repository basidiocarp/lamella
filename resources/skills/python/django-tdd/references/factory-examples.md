# Factory Boy Examples

Test factories for Django models.

## Factory Setup

```python
# tests/factories.py
import factory
from factory import fuzzy
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
// ... (47 lines trimmed)
        if extracted:
            for tag in extracted:
                self.tags.add(tag)
```

## Using Factories

```python
# tests/test_models.py
import pytest
from tests.factories import ProductFactory, UserFactory

def test_product_creation():
// ... (13 lines trimmed)
    """Test creating multiple products."""
    products = ProductFactory.create_batch(10)
    assert len(products) == 10
```
