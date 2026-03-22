# Django Test Examples

Model, view, serializer, and API testing examples.

## Model Testing

```python
# tests/test_models.py
import pytest
from django.core.exceptions import ValidationError
from tests.factories import UserFactory, ProductFactory

// ... (61 lines trimmed)

        with pytest.raises(ValueError):
            product.reduce_stock(10)  # Not enough stock
```

## View Testing

```python
# tests/test_views.py
import pytest
from django.urls import reverse
from tests.factories import ProductFactory, UserFactory

// ... (45 lines trimmed)

        assert response.status_code == 302
        assert Product.objects.filter(name='Test Product').exists()
```

## Serializer Testing

```python
# tests/test_serializers.py
import pytest
from rest_framework.exceptions import ValidationError
from apps.products.serializers import ProductSerializer
from tests.factories import ProductFactory
// ... (55 lines trimmed)

        assert not serializer.is_valid()
        assert 'stock' in serializer.errors
```

## API ViewSet Testing

```python
# tests/test_api.py
import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
// ... (93 lines trimmed)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
```
