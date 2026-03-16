# Mocking and Integration Testing

Patterns for mocking external services and full-flow integration tests.

## Mocking External Services

```python
# tests/test_views.py
from unittest.mock import patch, Mock
import pytest

class TestPaymentView:
// ... (31 lines trimmed)

        assert response.status_code == 302
        assert 'error' in response.url
```

## Mocking Email Sending

```python
# tests/test_email.py
from django.core import mail
from django.test import override_settings

@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
def test_order_confirmation_email(db, order):
    """Test order confirmation email."""
    order.send_confirmation_email()

    assert len(mail.outbox) == 1
    assert order.user.email in mail.outbox[0].to
    assert 'Order Confirmation' in mail.outbox[0].subject
```

## Integration Testing

### Full Flow Testing

```python
# tests/test_integration.py
import pytest
from django.urls import reverse
from tests.factories import UserFactory, ProductFactory

// ... (41 lines trimmed)

        assert response.status_code == 302
        assert Order.objects.filter(user__email='test@example.com').exists()
```

## Mocking Best Practices

### DO
- Mock at the boundary (external APIs, databases for unit tests)
- Use `@patch` decorator for clean test setup
- Configure return values that match real API responses
- Test both success and failure scenarios

### DON'T
- Mock internal implementation details
- Over-mock (prefer integration tests when possible)
- Forget to test error handling paths
- Use mocks without assertions on calls
