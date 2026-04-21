---
name: django-tdd
description: "Applies Django testing strategies with pytest-django, TDD, factory_boy, mocking, coverage, and DRF test patterns."
origin: lamella
---

# Django Testing with TDD

## Contents

- [When to Use](#when-to-use)
- [TDD Workflow](#tdd-workflow)
- [Testing Best Practices](#testing-best-practices)
- [Coverage](#coverage)
- [Quick Reference](#quick-reference)
- [References](#references)

## When to Use

- Writing new Django applications
- Implementing Django REST Framework APIs
- Testing Django models, views, and serializers
- Setting up testing infrastructure for Django projects

## TDD Workflow

### Red-Green-Refactor Cycle

```
RED     → Write failing test first
GREEN   → Write minimal code to pass
REFACTOR → Improve while keeping tests green
REPEAT  → Continue with next requirement
```

### Example

```python
# Step 1: RED - Write failing test
def test_user_creation():
    user = User.objects.create_user(email='test@example.com', password='testpass123')
    assert user.email == 'test@example.com'
    assert user.check_password('testpass123')

# Step 2: GREEN - Make test pass (implement User model)
# Step 3: REFACTOR - Improve while keeping tests green
```

## Testing Best Practices

### DO

- **Use factories** — Instead of manual object creation
- **One assertion per test** — Keep tests focused
- **Descriptive test names** — `test_user_cannot_delete_others_post`
- **Test edge cases** — Empty inputs, None values, boundary conditions
- **Mock external services** — Don't depend on external APIs
- **Use fixtures** — Eliminate duplication
- **Test permissions** — Ensure authorization works
- **Keep tests fast** — Use `--reuse-db` and `--nomigrations`

### DON'T

- **Don't test Django internals** — Trust Django to work
- **Don't test third-party code** — Trust libraries to work
- **Don't ignore failing tests** — All tests must pass
- **Don't make tests dependent** — Tests should run in any order
- **Don't over-mock** — Mock only external dependencies
- **Don't test private methods** — Test public interface
- **Don't use production database** — Always use test database

## Coverage

### Running Coverage

```bash
# Run tests with coverage
pytest --cov=apps --cov-report=html --cov-report=term-missing

# Generate HTML report
open htmlcov/index.html
```

### Coverage Targets

| Component | Target |
|-----------|--------|
| Models | 90%+ |
| Serializers | 85%+ |
| Views | 80%+ |
| Services | 90%+ |
| Utilities | 80%+ |
| **Overall** | **80%+** |

## Quick Reference

| Pattern | Usage |
|---------|-------|
| `@pytest.mark.django_db` | Enable database access |
| `client` | Django test client |
| `api_client` | DRF API client |
| `factory.create_batch(n)` | Create multiple objects |
| `patch('module.function')` | Mock external dependencies |
| `override_settings` | Temporarily change settings |
| `force_authenticate()` | Bypass authentication |
| `mail.outbox` | Check sent emails |

### Common Test Patterns

```python
# Test with factory
def test_product_creation():
    product = ProductFactory(price=100.00)
    assert product.price == 100.00

def test_product_validation():
    product = ProductFactory.build(price=-1)
    with pytest.raises(ValidationError):
        product.full_clean()

def test_payment(mock_stripe, client, user):
    mock_stripe.Charge.create.return_value = {'status': 'succeeded'}
    # ... test payment flow
```

## References

- [Setup](references/setup.md) — pytest config, test settings, conftest
- [Factory Examples](references/factory-examples.md) — Factory Boy patterns
- [Test Examples](references/test-examples.md) — Model, view, serializer, API tests
- [Mocking & Integration](references/mocking-integration.md) — Mocking patterns and integration tests
