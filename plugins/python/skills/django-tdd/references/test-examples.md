# Django Test Examples

Model, view, serializer, and API testing examples.

## Model Testing

```python
import pytest
from django.core.exceptions import ValidationError

from tests.factories import ProductFactory


@pytest.mark.django_db
def test_product_full_clean_rejects_negative_price():
    product = ProductFactory.build(price=-1)

    with pytest.raises(ValidationError):
        product.full_clean()


@pytest.mark.django_db
def test_reduce_stock_rejects_overdraw():
    product = ProductFactory(stock=4)

    with pytest.raises(ValueError):
        product.reduce_stock(10)
```

## View Testing

```python
import pytest
from django.urls import reverse

from apps.products.models import Product
from tests.factories import ProductFactory, UserFactory


@pytest.mark.django_db
def test_product_create_view_redirects_on_success(client):
    user = UserFactory()
    client.force_login(user)

    response = client.post(
        reverse("products:create"),
        {"name": "Test Product", "price": "19.99", "stock": 8},
    )

    assert response.status_code == 302
    assert Product.objects.filter(name="Test Product").exists()


@pytest.mark.django_db
def test_product_list_view_renders_existing_products(client):
    ProductFactory(name="Widget")

    response = client.get(reverse("products:list"))

    assert response.status_code == 200
    assert "Widget" in response.content.decode()
```

## Serializer Testing

```python
import pytest

from apps.products.serializers import ProductSerializer


@pytest.mark.django_db
def test_product_serializer_accepts_valid_payload():
    serializer = ProductSerializer(
        data={"name": "Widget", "price": "19.99", "stock": 3}
    )

    assert serializer.is_valid(), serializer.errors


@pytest.mark.django_db
def test_product_serializer_rejects_negative_stock():
    serializer = ProductSerializer(
        data={"name": "Widget", "price": "19.99", "stock": -1}
    )

    assert not serializer.is_valid()
    assert "stock" in serializer.errors
```

## API ViewSet Testing

```python
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from tests.factories import ProductFactory, UserFactory


@pytest.mark.django_db
def test_products_endpoint_lists_results():
    ProductFactory(name="Widget")
    client = APIClient()

    response = client.get(reverse("api:product-list"))

    assert response.status_code == status.HTTP_200_OK
    assert response.data["count"] == 1


@pytest.mark.django_db
def test_products_endpoint_requires_auth_for_create():
    user = UserFactory()
    client = APIClient()
    client.force_authenticate(user=user)

    response = client.post(
        reverse("api:product-list"),
        {"name": "Widget", "price": "19.99", "stock": 2},
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED
```
