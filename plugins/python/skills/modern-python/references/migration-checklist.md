# Migration Checklist

Use this checklist when migrating to modern Python tooling.

## Migration Steps

- move dependency management to `uv`
- configure linting with `ruff`
- configure typing with `ty`
- define dependency groups in `pyproject.toml`
- add CI verification for sync, lint, type-check, and tests
- decide whether `uv.lock` should be committed

## Verification

```bash
uv sync --all-groups
uv run ruff check .
uv run ty check .
uv run pytest
```
