# Django Testing Setup

pytest configuration, test settings, and conftest fixtures.

## pytest Configuration

```ini
# pytest.ini
[pytest]
DJANGO_SETTINGS_MODULE = config.settings.test
testpaths = tests
python_files = test_*.py
// ... (9 lines trimmed)
markers =
    slow: marks tests as slow
    integration: marks tests as integration tests
```

## Test Settings

```python
# config/settings/test.py
from .base import *

DEBUG = True
DATABASES = {
// ... (24 lines trimmed)
# Celery always eager
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True
```

## conftest.py

```python
# tests/conftest.py
import pytest
from django.utils import timezone
from django.contrib.auth import get_user_model

// ... (39 lines trimmed)
    """Return authenticated API client."""
    api_client.force_authenticate(user=user)
    return api_client
```
