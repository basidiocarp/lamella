# Injection Prevention

## SQL Injection Prevention

### Django ORM Protection

```python
# GOOD: Django ORM automatically escapes parameters
def get_user(username):
    return User.objects.get(username=username)  # Safe

# GOOD: Using parameters with raw()
// ... (15 lines trimmed)
        Q(username__icontains=query) |
        Q(email__icontains=query)
    )  # Safe
```

### Extra Security with raw()

```python
# If using raw SQL, always use parameters
User.objects.raw(
    'SELECT * FROM users WHERE email = %s AND status = %s',
    [user_input_email, status]
)
```

---

## XSS Prevention

### Template Escaping

```django
{# Django auto-escapes variables by default - SAFE #}
{{ user_input }}  {# Escaped HTML #}

{# Explicitly mark safe only for trusted content #}
{{ trusted_html|safe }}  {# Not escaped #}

{# Use template filters for safe HTML #}
{{ user_input|escape }}  {# Same as default #}
{{ user_input|striptags }}  {# Remove all HTML tags #}

{# JavaScript escaping #}
<script>
    var username = {{ username|escapejs }};
</script>
```

### Safe String Handling

```python
from django.utils.safestring import mark_safe
from django.utils.html import escape

# BAD: Never mark user input as safe without escaping
def render_bad(user_input):
// ... (8 lines trimmed)

def greet_user(username):
    return format_html('<span class="user">{}</span>', escape(username))
```

### HTTP Headers

```python
# settings.py
SECURE_CONTENT_TYPE_NOSNIFF = True  # Prevent MIME sniffing
SECURE_BROWSER_XSS_FILTER = True  # Enable XSS filter
X_FRAME_OPTIONS = 'DENY'  # Prevent clickjacking

// ... (9 lines trimmed)
        response['X-XSS-Protection'] = '1; mode=block'
        response['Content-Security-Policy'] = "default-src 'self'"
        return response
```

---

## CSRF Protection

### Default CSRF Protection

```python
# settings.py - CSRF is enabled by default
CSRF_COOKIE_SECURE = True  # Only send over HTTPS
CSRF_COOKIE_HTTPONLY = True  # Prevent JavaScript access
CSRF_COOKIE_SAMESITE = 'Lax'  # Prevent CSRF in some cases
CSRF_TRUSTED_ORIGINS = ['https://example.com']  # Trusted domains
```

### Template Usage

```html
<form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Submit</button>
</form>
```

### AJAX Requests

```javascript
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
// ... (15 lines trimmed)
    },
    body: JSON.stringify(data)
});
```

### Exempting Views (Use Carefully)

```python
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt  # Only use when absolutely necessary!
def webhook_view(request):
    # Webhook from external service
    pass
```
