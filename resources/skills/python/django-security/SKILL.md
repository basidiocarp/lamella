---
name: django-security
description: "Applies Django security patterns for auth, CSRF, XSS, and deployment."
origin: lamella
---

# Django Security Best Practices


## Contents

- [When to Use](#when-to-use)
- [Quick Security Checklist](#quick-security-checklist)
- [Core Security Settings](#core-security-settings)
- [Authentication Quick Reference](#authentication-quick-reference)
- [Authorization Quick Reference](#authorization-quick-reference)
- [Injection Prevention](#injection-prevention)
- [Reference Files](#reference-files)


Comprehensive security guidelines for Django applications to protect against common vulnerabilities.

## When to Use

- Setting up Django authentication and authorization
- Implementing user permissions and roles
- Configuring production security settings
- Reviewing Django application for security issues
- Deploying Django applications to production

## Installation

```bash
pip install django
```

## Quick Security Checklist

| Check | Description |
|-------|-------------|
| `DEBUG = False` | Never run with DEBUG in production |
| HTTPS only | Force SSL, secure cookies |
| Strong secrets | Use environment variables for SECRET_KEY |
| Password validation | Enable all password validators |
| CSRF protection | Enabled by default, don't disable |
| XSS prevention | Django auto-escapes, don't use `|safe` with user input |
| SQL injection | Use ORM, never concatenate strings in queries |
| File uploads | Validate file type and size |
| Rate limiting | Throttle API endpoints |
| Security headers | CSP, X-Frame-Options, HSTS |

## Core Security Settings

```python
# settings/production.py
DEBUG = False  # CRITICAL

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
ALLOWED_HOSTS = ["example.com"]

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
if not SECRET_KEY:
    raise ImproperlyConfigured('DJANGO_SECRET_KEY required')
```

## Authentication Quick Reference

```python
# Custom user model (recommended)
class User(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

# settings.py
AUTH_USER_MODEL = 'users.User'

# Stronger password hashing
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
]
```

## Authorization Quick Reference

```python
# View permission check
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin

class PostUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Post
    permission_required = 'app.can_edit_others'
    raise_exception = True

# DRF permission
class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user
```

## Injection Prevention

### SQL Injection
```python
# ✅ GOOD: ORM automatically escapes
User.objects.filter(username=user_input)

# ✅ GOOD: Parameterized raw query
User.objects.raw('SELECT * FROM users WHERE username = %s', [user_input])

# ❌ BAD: String interpolation
User.objects.raw(f'SELECT * FROM users WHERE username = {user_input}')
```

### XSS Prevention
```django
{# Django auto-escapes by default - SAFE #}
{{ user_input }}

{# Only use |safe for trusted content #}
{{ trusted_html|safe }}

{# JavaScript escaping #}
<script>var name = {{ username|escapejs }};</script>
```

### CSRF Protection
```html
<form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Submit</button>
</form>
```

## Reference Files

| File | Description |
|------|-------------|
| [production-settings.md](references/production-settings.md) | Full production config, env vars, logging |
| [authentication.md](references/authentication.md) | Custom user model, password hashing, sessions |
| [authorization.md](references/authorization.md) | Permissions, RBAC, DRF permissions |
| [injection-prevention.md](references/injection-prevention.md) | SQL injection, XSS, CSRF full examples |
| [api-security.md](references/api-security.md) | Rate limiting, API auth, CSP, file uploads |

Remember: Security is a process, not a product. Regularly review and update your security practices.
