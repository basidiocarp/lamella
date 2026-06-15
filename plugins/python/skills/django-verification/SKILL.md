---
name: django-verification
description: "Verifies Django projects with migrations, linting, coverage-backed tests, security scans, and deployment-readiness checks."
origin: lamella
---

# Django Verification Loop

Use this skill when you need a release-style verification pass across a Django project. The goal is a short, defensible checklist that catches migration, test, security, and deployment regressions before a PR or deploy.

## When to Use

- Before opening a Django pull request
- After model or migration-heavy changes
- Before a staging or production deploy
- After dependency upgrades or settings changes

## Verification Order

1. Check Python version, env vars, and runtime configuration.
2. Run linting, formatting, and Django system checks.
3. Verify migrations are present, ordered, and conflict-free.
4. Run tests with coverage and summarize failures.
5. Run dependency and settings security checks.
6. Verify static assets, logging, and API schema generation if applicable.
7. Review the diff for debug code, secrets, and undocumented config changes.

## Minimal Command Set

```bash
python manage.py check --deploy
python manage.py showmigrations
python manage.py makemigrations --check --dry-run
pytest --cov=apps --cov-report=term-missing --reuse-db
pip-audit
safety check --full-report
python manage.py collectstatic --noinput
git diff --stat
```

## What to Report

- Migration status and conflicts
- Test results and coverage summary
- Security findings and dependency issues
- Deploy-readiness risks such as `DEBUG`, missing env vars, or static asset failures
- Any manual follow-up needed before merge or deploy

## Guardrails

- Stop early on broken environment or migration state.
- Treat missing migrations as a blocker.
- Do not ignore `check --deploy` failures for production paths.
- Call out low coverage on changed critical paths even if the global threshold passes.
