# Django REST Framework Examples

Detailed serializer and viewset patterns.

## Serializer Patterns

```python
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Product, User


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "price", "stock", "is_active"]
        read_only_fields = ["id"]

    def validate_stock(self, value: int) -> int:
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative.")
        return value


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ["email", "password", "first_name", "last_name"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
```

## ViewSet Patterns

```python
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_active"]
    search_fields = ["name", "description"]
    ordering_fields = ["price", "created_at"]

    def get_queryset(self):
        return (
            Product.objects.filter(is_active=True)
            .select_related("category")
            .prefetch_related("tags")
        )
```

## Custom Actions

```python
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response


class CartViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["post"], url_path="add-item")
    def add_item(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        add_item_to_cart(
            user=request.user,
            product_id=serializer.validated_data["product_id"],
            quantity=serializer.validated_data["quantity"],
        )

        return Response({"message": "Added to cart"}, status=status.HTTP_201_CREATED)
```
