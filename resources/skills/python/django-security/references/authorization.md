# Django Authorization

## Model Permissions

```python
# models.py
from django.db import models
from django.contrib.auth.models import Permission

class Post(models.Model):
// ... (23 lines trimmed)
    def get_queryset(self):
        """Only allow users to edit their own posts."""
        return Post.objects.filter(author=self.request.user)
```

---

## DRF Custom Permissions

```python
# permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """Allow only owners to edit objects."""
// ... (19 lines trimmed)

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_verified
```

---

## Role-Based Access Control (RBAC)

```python
# models.py
from django.contrib.auth.models import AbstractUser, Group

class User(AbstractUser):
    ROLE_CHOICES = [
// ... (18 lines trimmed)
            from django.core.exceptions import PermissionDenied
            raise PermissionDenied
        return super().dispatch(request, *args, **kwargs)
```
