---
name: django-patterns
description: >-
  Guides Django development with architecture patterns, REST API design with DRF,
  ORM best practices, authentication, testing, caching, signals, middleware, and
  production-grade Django apps. Use when building Django web apps, designing DRF APIs,
  implementing models, views, serializers, or authentication.
---

# Django Development Patterns

## Contents

- [When to Use](#when-to-use)
- [Project Structure](#project-structure)
- [Model Design Patterns](#model-design-patterns)
- [Django REST Framework Patterns](#django-rest-framework-patterns)
- [Performance Optimization](#performance-optimization)
- [Quick Reference](#quick-reference)
- [References](#references)

## When to Use

- Building Django web applications
- Designing Django REST Framework APIs
- Working with Django ORM and models
- Setting up Django project structure
- Implementing caching, signals, middleware

## Installation

```bash
pip install django djangorestframework
```

## Project Structure

### Recommended Layout

```
myproject/
├── config/
│   ├── settings/
│   │   ├── base.py          # Base settings
│   │   ├── development.py   # Dev settings
// ... (12 lines trimmed)
    │   ├── services.py
    │   └── tests/
    └── products/
```

## Model Design Patterns

### Key Patterns

```python
# Custom QuerySet for chainable methods
class ProductQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)

// ... (9 lines trimmed)
            return self.get(**kwargs)
        except self.model.DoesNotExist:
            return None
```

### Model Meta Options

```python
class Meta:
    db_table = 'products'
    ordering = ['-created_at']
    indexes = [
        models.Index(fields=['slug']),
        models.Index(fields=['category', 'is_active']),
    ]
    constraints = [
        models.CheckConstraint(
            check=models.Q(price__gte=0),
            name='price_non_negative'
        )
    ]
```

## Django REST Framework Patterns

### Serializer Patterns

```python
class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    discount_price = serializers.SerializerMethodField()

    def get_discount_price(self, obj):
        if hasattr(obj, 'discount') and obj.discount:
            return obj.price * (1 - obj.discount.percent / 100)
        return obj.price
```

### ViewSet Patterns

```python
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').prefetch_related('tags')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'description']

    def get_serializer_class(self):
        if self.action == 'create':
            return ProductCreateSerializer
        return ProductSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = self.queryset.filter(is_featured=True)[:10]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)
```

## Performance Optimization

### N+1 Query Prevention

```python
# Bad - N+1 queries
for product in Product.objects.all():
    print(product.category.name)  # Separate query each time

# Good - Single query
for product in Product.objects.select_related('category').all():
    print(product.category.name)

# Many-to-many - use prefetch_related
Product.objects.prefetch_related('tags').all()
```

### Caching Pattern

```python
from django.core.cache import cache

def get_featured_products():
    cache_key = 'featured_products'
    products = cache.get(cache_key)
    if products is None:
        products = list(Product.objects.filter(is_featured=True))
        cache.set(cache_key, products, timeout=60 * 15)
    return products
```

## Quick Reference

| Pattern | Description |
|---------|-------------|
| Split settings | Separate dev/prod/test settings |
| Custom QuerySet | Reusable query methods |
| Service Layer | Business logic separation |
| ViewSet | REST API endpoints |
| Serializer validation | Request/response transformation |
| select_related | Foreign key optimization |
| prefetch_related | Many-to-many optimization |
| Cache first | Cache expensive operations |
| Signals | Event-driven actions |
| Middleware | Request/response processing |

## References

- [Settings Examples](references/settings-examples.md) — Split settings configuration
- [Model Examples](references/model-examples.md) — QuerySet and Manager patterns
- [DRF Examples](references/drf-examples.md) — Serializer and ViewSet patterns
- [Additional Patterns](references/additional-patterns.md) — Service layer, caching, signals, middleware
- [Authentication](references/authentication.md) — Auth, permissions, JWT, session management
- [Testing Django](references/testing-django.md) — TestCase, fixtures, DRF test patterns
- [ViewSets & Views](references/viewsets-views.md) — ViewSet types, routing, filtering, pagination
