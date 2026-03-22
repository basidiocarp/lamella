# Authentication

## SimpleJWT Setup

```python
# settings.py
INSTALLED_APPS = [
    ...
    'rest_framework_simplejwt',
]
// ... (24 lines trimmed)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

## Custom Token Claims

```python
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['role'] = user.role
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
```

## Custom Permissions

```python
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
// ... (10 lines trimmed)
    def has_permission(self, request, view):
        api_key = request.headers.get('X-API-Key')
        return api_key == settings.API_KEY
```

## Permission Classes on ViewSet

```python
class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_permissions(self):
        if self.action == 'destroy':
            return [permissions.IsAdminUser()]
        if self.action in ['create', 'update', 'partial_update']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
```

## User Registration

```python
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
// ... (12 lines trimmed)
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
```

## Current User Endpoint

```python
class CurrentUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
```

## Quick Reference

| Permission | Access |
|------------|--------|
| `AllowAny` | Everyone |
| `IsAuthenticated` | Logged in users |
| `IsAdminUser` | Staff users |
| `IsAuthenticatedOrReadOnly` | Auth for write |

| JWT Endpoint | Purpose |
|--------------|---------|
| `/token/` | Get access + refresh |
| `/token/refresh/` | New access from refresh |
| `/token/verify/` | Validate token |
