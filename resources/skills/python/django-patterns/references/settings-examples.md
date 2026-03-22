# Django Settings Examples

Detailed settings configuration for split settings pattern.

## Base Settings

```python
# config/settings/base.py
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

// ... (41 lines trimmed)
        'PORT': env('DB_PORT', default='5432'),
    }
}
```

## Development Settings

```python
# config/settings/development.py
from .base import *

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

DATABASES['default']['NAME'] = 'myproject_dev'

INSTALLED_APPS += ['debug_toolbar']

MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

## Production Settings

```python
# config/settings/production.py
from .base import *

DEBUG = False
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')
// ... (23 lines trimmed)
        },
    },
}
```
