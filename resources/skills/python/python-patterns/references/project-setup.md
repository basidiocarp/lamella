# Project Setup and Tooling

Prefer a predictable `src/` layout, a single `pyproject.toml`, and a small
toolchain that covers formatting, linting, typing, testing, and dependency
audit.

## Recommended Shape

- `src/<package>/` for application code
- `tests/` for test modules
- `pyproject.toml` as the main config entry point
- `README.md` and `.gitignore` at repo root

## Tooling Baseline

- formatter: `ruff format` or `black`
- linter: `ruff check`
- typing: `mypy` or project-standard type checker
- testing: `pytest`
- security/dependency audit: `bandit`, `pip-audit`

## Rules

- keep import order consistent and automated
- expose only stable package-level exports in `__init__.py`
- avoid scattering tool configuration across many legacy files when
  `pyproject.toml` can hold it
