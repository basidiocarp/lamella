# Django Model Examples

Detailed model patterns with QuerySets and Managers.

## Complete Model Example

```python
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

class User(AbstractUser):
// ... (60 lines trimmed)
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
```

## Custom QuerySet

```python
from django.db import models

class ProductQuerySet(models.QuerySet):
    """Custom QuerySet for Product model."""

// ... (27 lines trimmed)

# Usage
Product.objects.active().with_category().in_stock()
```

## Custom Manager

```python
class ProductManager(models.Manager):
    """Custom manager for complex queries."""

    def get_or_none(self, **kwargs):
        """Return object or None instead of DoesNotExist."""
// ... (17 lines trimmed)
class Product(models.Model):
    # ... fields ...
    custom = ProductManager()
```
