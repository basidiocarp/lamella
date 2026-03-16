# Django Production Settings

## Full Production Configuration

```python
# settings/production.py
import os
from django.core.exceptions import ImproperlyConfigured

DEBUG = False  # CRITICAL: Never use True in production
// ... (40 lines trimmed)
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
```

---

## Environment Variables Management

```python
# Use python-decouple or django-environ
import environ

env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)

# reading .env file
environ.Env.read_env()

SECRET_KEY = env('DJANGO_SECRET_KEY')
DATABASE_URL = env('DATABASE_URL')
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')
```

Example `.env` file (never commit this):
```
DEBUG=False
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
ALLOWED_HOSTS=example.com,www.example.com
```

---

## Security Logging

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
// ... (19 lines trimmed)
        },
    },
}
```
