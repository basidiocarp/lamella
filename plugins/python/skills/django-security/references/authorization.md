# Django Authorization

## Model Permissions

```python
# models.py
from django.db import models
from django.views.generic import UpdateView


class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    author = models.ForeignKey("auth.User", on_delete=models.CASCADE)

    class Meta:
        permissions = [
            ("publish_post", "Can publish posts"),
            ("archive_post", "Can archive posts"),
        ]

    def can_edit(self, user):
        return user.is_superuser or user == self.author or user.has_perm("blog.change_post")


class PostUpdateView(UpdateView):
    model = Post
    fields = ["title", "body"]

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

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user


class IsVerifiedUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_verified
        )
```

---

## Role-Based Access Control (RBAC)

```python
# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.core.exceptions import PermissionDenied
from django.views import View


class User(AbstractUser):
    ROLE_CHOICES = [
        ("author", "Author"),
        ("editor", "Editor"),
        ("admin", "Admin"),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="author")

    def sync_role_group(self):
        if self.role:
            group, _ = Group.objects.get_or_create(name=self.role)
            self.groups.set([group])


class AdminOnlyView(View):
    def dispatch(self, request, *args, **kwargs):
        if request.user.role != "admin":
            raise PermissionDenied
        return super().dispatch(request, *args, **kwargs)
```
