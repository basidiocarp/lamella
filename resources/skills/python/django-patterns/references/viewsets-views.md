# ViewSets & Views

## ModelViewSet

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
// ... (37 lines trimmed)
        featured = self.get_queryset().filter(is_featured=True)[:10]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)
```

## Django 5.0 Async Views

```python
from django.http import JsonResponse
from asgiref.sync import sync_to_async

# Async function-based view
async def user_list(request):
// ... (15 lines trimmed)
            'name': product.name,
            'category': product.category.name,
        })
```

## Generic Views

```python
from rest_framework import generics

class ProductListCreate(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'
```

## URL Configuration

```python
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('products', ProductViewSet, basename='product')

urlpatterns = [
    path('api/', include(router.urls)),
]

# Generated URLs:
# GET/POST    /api/products/
# GET/PUT/DELETE /api/products/{slug}/
# POST        /api/products/{slug}/purchase/
# GET         /api/products/featured/
```

## Pagination

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
// ... (8 lines trimmed)

class ProductViewSet(viewsets.ModelViewSet):
    pagination_class = LargeResultsSetPagination
```

## Quick Reference

| ViewSet Method | HTTP | Action |
|---------------|------|--------|
| `list()` | GET | List all |
| `create()` | POST | Create new |
| `retrieve()` | GET | Get one |
| `update()` | PUT | Full update |
| `partial_update()` | PATCH | Partial update |
| `destroy()` | DELETE | Delete |

| Hook | Purpose |
|------|---------|
| `get_queryset()` | Filter queryset |
| `get_serializer_class()` | Dynamic serializer |
| `perform_create()` | Pre-save logic |
| `@action()` | Custom endpoints |
