# Ruff Configuration Reference

Use Ruff as the default linter and formatter for modern Python projects unless
the repo has a strong reason to keep a different stack.

## Core Setup

Typical configuration lives in `pyproject.toml` and defines:
- target Python version
- line length
- source roots
- selected or ignored rule families
- formatter preferences

Keep the config small at first. Expand only when the repo actually needs more
granular rule tuning.

## Common Commands

Typical workflow:
- `ruff check .`
- `ruff check --fix .`
- `ruff format .`
- `ruff format --check .`

Use `--unsafe-fixes` only when you are prepared to review broader changes.

## Rule Strategy

A practical approach:
- start with core correctness and import/style families
- add stronger rule groups gradually
- use per-file ignores only where there is a stable reason

Do not enable everything just because Ruff can. The best config is the one the
repo will actually keep clean.

## Formatter Relationship

Ruff can replace separate lint and formatting tools for many repos. If you do
that, remove redundant tool config instead of maintaining overlapping style
systems.

## Type Checking

Ruff is not a type checker. Pair it with a dedicated type-checking tool when the
project needs typed validation.

## Migration Rule

When moving from older tools:
- match the repo’s current line length first
- keep churn low
- tighten policy only after the migration is stable

A good Ruff setup improves speed and consistency without turning every cleanup
into a config war.
