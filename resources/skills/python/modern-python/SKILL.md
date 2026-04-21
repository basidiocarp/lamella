---
name: modern-python
description: "Configures Python projects with modern tooling (uv, ruff, ty)."
origin: lamella
---

# Modern Python

Use this skill when setting up or modernizing a Python project around `uv`, `ruff`, `ty`, and a `pyproject.toml`-first workflow. Keep this file as the routing layer for tool choices and migration direction.

## When to Use

- Starting a new Python project or package
- Migrating from `pip`, `requirements.txt`, Poetry, or older lint/type stacks
- Standardizing on `uv`, `ruff`, and `ty`
- Setting up dependency groups, scripts, and CI-friendly tooling

## Core Defaults

| Area | Preferred Tool |
|------|----------------|
| Dependency management | `uv` |
| Linting and formatting | `ruff` |
| Type checking | `ty` |
| Tests | `pytest` |
| Script metadata | PEP 723 for standalone scripts |
| Project metadata | `pyproject.toml` |

## Core Workflow

1. Decide whether the target is a standalone script or a real project.
2. Initialize the project with `uv`.
3. Add dependencies with `uv add`, not manual file edits.
4. Configure lint, type, and test tooling in `pyproject.toml`.
5. Add security and dependency automation only after the base workflow is stable.
6. For migrations, replace one tool layer at a time and re-run validation after each step.

## Minimal Project Bootstrap

```bash
uv init --package myproject
cd myproject
uv add httpx
uv add --group dev pytest ruff ty
uv sync --all-groups
uv run ruff check .
uv run ty check
uv run pytest
```

## References

- [references/pyproject.md](references/pyproject.md)
- [references/uv-commands.md](references/uv-commands.md)
- [references/pep723-scripts.md](references/pep723-scripts.md)
- [references/ruff-config.md](references/ruff-config.md)
- [references/testing.md](references/testing.md)
- [references/security-setup.md](references/security-setup.md)
- [references/migration-checklist.md](references/migration-checklist.md)
- [references/prek.md](references/prek.md)
- [references/dependabot.md](references/dependabot.md)
