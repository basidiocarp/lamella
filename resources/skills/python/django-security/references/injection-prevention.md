# Injection Prevention

Use Django's secure defaults first, then add explicit hardening where the stack
crosses trust boundaries.

## SQL Injection

- prefer ORM queries over hand-built SQL
- if raw SQL is unavoidable, use parameter binding every time
- keep complex search logic in ORM expressions where possible

## XSS

- rely on Django's default template escaping
- mark content safe only when it is trusted and already sanitized
- escape user data again when embedding it into JavaScript or HTML fragments

## CSRF

- keep CSRF protection enabled for browser-backed forms and session auth
- include `{% csrf_token %}` in forms
- exempt views only for real external webhook cases, and document why
