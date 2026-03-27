# Factory Boy Examples

Test factories for Django models.

## Factory Setup

```python
from datetime import timedelta

import factory
from django.contrib.auth import get_user_model
from django.utils import timezone

from apps.products.models import Product, Tag


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    email = factory.Sequence(lambda n: f"user{n}@example.com")
    username = factory.Sequence(lambda n: f"user{n}")


class TagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Tag

    name = factory.Sequence(lambda n: f"tag-{n}")


class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Product

    name = factory.Sequence(lambda n: f"Product {n}")
    price = "19.99"
    stock = 5
    published_at = factory.LazyFunction(lambda: timezone.now() + timedelta(days=1))

    @factory.post_generation
    def tags(self, create, extracted, **kwargs):
        if not create or not extracted:
            return
        for tag in extracted:
            self.tags.add(tag)
```

## Using Factories

```python
import pytest

from tests.factories import ProductFactory, TagFactory, UserFactory


@pytest.mark.django_db
def test_product_creation():
    product = ProductFactory()

    assert product.pk is not None
    assert product.stock == 5


@pytest.mark.django_db
def test_product_with_tags():
    tag = TagFactory(name="featured")
    product = ProductFactory(tags=[tag])

    assert product.tags.filter(name="featured").exists()


@pytest.mark.django_db
def test_create_batch():
    products = ProductFactory.create_batch(3)

    assert len(products) == 3
    assert all(product.pk for product in products)
```
