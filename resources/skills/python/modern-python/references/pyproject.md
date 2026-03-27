# pyproject.toml Configuration Reference

Use `uv add` and `uv remove` for dependency changes instead of editing dependency arrays by hand.

## Minimal Example

```toml
[project]
name = "myproject"
version = "0.1.0"
description = "A modern Python project"
readme = "README.md"
requires-python = ">=3.12"
dependencies = []

[build-system]
requires = ["uv_build>=0.9,<1"]
build-backend = "uv_build"

[dependency-groups]
dev = ["ruff", "ty", "pytest"]
```

## Key Sections

- `[project]`
- `[project.scripts]`
- `[build-system]`
- `[dependency-groups]`
- `[tool.uv]`

## Lockfile Rule

- applications usually commit `uv.lock`
- libraries usually do not
