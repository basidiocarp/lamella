# Testing Django

## APITestCase

```python
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

class ProductAPITest(APITestCase):
// ... (40 lines trimmed)
        response = self.client.post(url, {'name': 'Test'})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
```

## Model Tests

```python
from django.test import TestCase
from django.core.exceptions import ValidationError

class ProductModelTest(TestCase):
    def setUp(self):
// ... (27 lines trimmed)
                name='Second', slug='test', price=20,
                category=self.category, created_by=self.user
            )
```

## Fixtures

```python
# fixtures/products.json
[
  {
    "model": "products.category",
    "pk": 1,
// ... (18 lines trimmed)
    def test_with_fixture(self):
        product = Product.objects.get(slug='laptop')
        self.assertEqual(product.name, 'Laptop')
```

## Factory Boy

```python
import factory
from factory.django import DjangoModelFactory

class UserFactory(DjangoModelFactory):
    class Meta:
// ... (17 lines trimmed)
    def test_with_factory(self):
        product = ProductFactory(price=100)
        self.assertEqual(product.price, 100)
```

## Testing JWT

```python
class JWTAuthTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            username='test',
// ... (21 lines trimmed)
        response = self.client.get('/api/protected/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
```

## Quick Reference

| Method | Purpose |
|--------|---------|
| `force_authenticate()` | Skip auth |
| `credentials()` | Set headers |
| `reverse()` | URL by name |
| `fixtures` | Load test data |

| Assertion | Check |
|-----------|-------|
| `assertEqual()` | Exact match |
| `assertContains()` | Response contains |
| `assertRaises()` | Exception raised |
