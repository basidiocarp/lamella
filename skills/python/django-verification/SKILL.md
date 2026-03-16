---
name: django-verification
description: "Verification loop for Django projects: migrations, linting, tests with coverage, security scans, and deployment readiness checks before release or PR. Use when preparing Django PRs, verifying migrations, running pre-deployment checks, or validating test coverage."
---

# Django Verification Loop


## Contents

- [When to Use](#when-to-use)
- [Phase 1: Environment Check](#phase-1-environment-check)
- [Phase 2: Code Quality & Formatting](#phase-2-code-quality-formatting)
- [Phase 3: Migrations](#phase-3-migrations)
- [Phase 4: Tests + Coverage](#phase-4-tests-coverage)
- [Phase 5: Security Scan](#phase-5-security-scan)
- [Phase 6: Django Management Commands](#phase-6-django-management-commands)
- [Phase 7: Performance Checks](#phase-7-performance-checks)
- [Phase 8: Static Assets](#phase-8-static-assets)
- [Phase 9: Configuration Review](#phase-9-configuration-review)
- [Phase 10: Logging Configuration](#phase-10-logging-configuration)
- [Phase 11: API Documentation (if DRF)](#phase-11-api-documentation-if-drf)
- [Phase 12: Diff Review](#phase-12-diff-review)
- [Output Template](#output-template)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Continuous Integration](#continuous-integration)
  - [GitHub Actions Example](#github-actions-example)
- [Quick Reference](#quick-reference)


Run before PRs, after major changes, and pre-deploy to ensure Django application quality and security.

## When to Use

- Before opening a pull request for a Django project
- After major model changes, migration updates, or dependency upgrades
- Pre-deployment verification for staging or production
- Running full environment → lint → test → security → deploy readiness pipeline
- Validating migration safety and test coverage

## Phase 1: Environment Check

```bash
# Verify Python version
python --version  # Should match project requirements

# Check virtual environment
which python
pip list --outdated

# Verify environment variables
python -c "import os; import environ; print('DJANGO_SECRET_KEY set' if os.environ.get('DJANGO_SECRET_KEY') else 'MISSING: DJANGO_SECRET_KEY')"
```

If environment is misconfigured, stop and fix.

## Phase 2: Code Quality & Formatting

```bash
# Type checking
mypy . --config-file pyproject.toml

# Linting with ruff
ruff check . --fix
// ... (8 lines trimmed)

# Django-specific checks
python manage.py check --deploy
```

Common issues:
- Missing type hints on public functions
- PEP 8 formatting violations
- Unsorted imports
- Debug settings left in production configuration

## Phase 3: Migrations

```bash
# Check for unapplied migrations
python manage.py showmigrations

# Create missing migrations
// ... (8 lines trimmed)
# Check for migration conflicts
python manage.py makemigrations --merge  # Only if conflicts exist
```

Report:
- Number of pending migrations
- Any migration conflicts
- Model changes without migrations

## Phase 4: Tests + Coverage

```bash
# Run all tests with pytest
pytest --cov=apps --cov-report=html --cov-report=term-missing --reuse-db

# Run specific app tests
// ... (6 lines trimmed)
# Coverage report
open htmlcov/index.html
```

Report:
- Total tests: X passed, Y failed, Z skipped
- Overall coverage: XX%
- Per-app coverage breakdown

Coverage targets:

| Component | Target |
|-----------|--------|
| Models | 90%+ |
| Serializers | 85%+ |
| Views | 80%+ |
| Services | 90%+ |
| Overall | 80%+ |

## Phase 5: Security Scan

```bash
# Dependency vulnerabilities
pip-audit
safety check --full-report

// ... (9 lines trimmed)
# Environment variable check
python -c "from django.core.exceptions import ImproperlyConfigured; from django.conf import settings; settings.DEBUG"
```

Report:
- Vulnerable dependencies found
- Security configuration issues
- Hardcoded secrets detected
- DEBUG mode status (should be False in production)

## Phase 6: Django Management Commands

```bash
# Check for model issues
python manage.py check

# Collect static files
// ... (8 lines trimmed)
# Cache verification (if using Redis)
python -c "from django.core.cache import cache; cache.set('test', 'value', 10); print(cache.get('test'))"
```

## Phase 7: Performance Checks

```bash
# Django Debug Toolbar output (check for N+1 queries)
# Run in dev mode with DEBUG=True and access a page
# Look for duplicate queries in SQL panel

// ... (8 lines trimmed)
    print(cursor.fetchall())
EOF
```

Report:
- Number of queries per page (should be < 50 for typical pages)
- Missing database indexes
- Duplicate queries detected

## Phase 8: Static Assets

```bash
# Check for npm dependencies (if using npm)
npm audit
npm audit fix

# Build static files (if using webpack/vite)
npm run build

# Verify static files
ls -la staticfiles/
python manage.py findstatic css/style.css
```

## Phase 9: Configuration Review

```python
# Run in Python shell to verify settings
python manage.py shell << EOF
from django.conf import settings
import os

// ... (11 lines trimmed)
    status = '✓' if result else '✗'
    print(f"{status} {check}")
EOF
```

## Phase 10: Logging Configuration

```bash
# Test logging output
python manage.py shell << EOF
import logging
logger = logging.getLogger('django')
logger.warning('Test warning message')
logger.error('Test error message')
EOF

# Check log files (if configured)
tail -f /var/log/django/django.log
```

## Phase 11: API Documentation (if DRF)

```bash
# Generate schema
python manage.py generateschema --format openapi-json > schema.json

# Validate schema
# Check if schema.json is valid JSON
python -c "import json; json.load(open('schema.json'))"

# Access Swagger UI (if using drf-yasg)
# Visit http://localhost:8000/swagger/ in browser
```

## Phase 12: Diff Review

```bash
# Show diff statistics
git diff --stat

# Show actual changes
// ... (8 lines trimmed)
git diff | grep "DEBUG = True"  # Debug mode
git diff | grep "import pdb"  # Debugger
```

Checklist:
- No debugging statements (print, pdb, breakpoint())
- No TODO/FIXME comments in critical code
- No hardcoded secrets or credentials
- Database migrations included for model changes
- Configuration changes documented
- Error handling present for external calls
- Transaction management where needed

## Output Template

```
DJANGO VERIFICATION REPORT
==========================

Phase 1: Environment Check
  ✓ Python 3.11.5
// ... (72 lines trimmed)
1. Update vulnerable dependencies
2. Re-run security scan
3. Deploy to staging for final testing
```

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Coverage ≥ 80%
- [ ] No security vulnerabilities
- [ ] No unapplied migrations
- [ ] DEBUG = False in production settings
- [ ] SECRET_KEY properly configured
- [ ] ALLOWED_HOSTS set correctly
- [ ] Database backups enabled
- [ ] Static files collected and served
- [ ] Logging configured and working
- [ ] Error monitoring (Sentry, etc.) configured
- [ ] CDN configured (if applicable)
- [ ] Redis/cache backend configured
- [ ] Celery workers running (if applicable)
- [ ] HTTPS/SSL configured
- [ ] Environment variables documented

## Continuous Integration

### GitHub Actions Example

```yaml
# .github/workflows/django-verification.yml
name: Django Verification

on: [push, pull_request]

// ... (52 lines trimmed)

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Quick Reference

| Check | Command |
|-------|---------|
| Environment | `python --version` |
| Type checking | `mypy .` |
| Linting | `ruff check .` |
| Formatting | `black . --check` |
| Migrations | `python manage.py makemigrations --check` |
| Tests | `pytest --cov=apps` |
| Security | `pip-audit && bandit -r .` |
| Django check | `python manage.py check --deploy` |
| Collectstatic | `python manage.py collectstatic --noinput` |
| Diff stats | `git diff --stat` |

Remember: Automated verification catches common issues but doesn't replace manual code review and testing in staging environment.
