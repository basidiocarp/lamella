# Python Project Scaffolding

Generate a complete Python project structure with modern tooling based on user requirements.

## Requirements

$ARGUMENTS

## Instructions

### 1. Determine Project Type

- FastAPI: REST APIs, microservices, async applications
- Django: Full-stack web apps, admin panels, ORM-heavy projects
- Library: Reusable packages for distribution
- CLI: Command-line tools with typer or click
- Generic: Standard Python applications

### 2. Initialize with uv

```bash
uv init <project-name>
cd <project-name>
git init
uv venv
```

### 3. Apply Project Structure

Use `src/` layout for all project types:

```
project/
├── pyproject.toml
├── src/
│   └── project_name/
│       ├── __init__.py
│       └── ...
├── tests/
│   ├── conftest.py
│   └── ...
├── .env.example
├── .gitignore
└── Makefile
```

FastAPI adds: `api/v1/endpoints/`, `core/`, `models/`, `schemas/`, `services/` under `src/`.

Django uses: `django-admin startproject config .` then `python manage.py startapp core`.

Library adds: `py.typed`, `LICENSE`, uses hatchling as build backend.

CLI adds: `[project.scripts]` entry point, typer + rich dependencies.

### 4. Configure pyproject.toml

Every project gets:

```toml
[project]
requires-python = ">=3.11"

[project.optional-dependencies]
dev = ["pytest>=8.0", "ruff>=0.2.0"]

[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "W", "UP"]

[tool.pytest.ini_options]
testpaths = ["tests"]
```

Add framework-specific dependencies based on project type.

### 5. Generate Makefile

```makefile
.PHONY: install dev test lint format clean

install:
	uv sync

test:
	uv run pytest -v

lint:
	uv run ruff check .

format:
	uv run ruff format .
```

### 6. Generate .gitignore and .env.example

Include `.venv/`, `__pycache__/`, `.pytest_cache/`, `.ruff_cache/`, `*.pyc`.

Create `.env.example` with placeholder values for any config the project needs.

## Output

1. Complete directory tree with all files
2. pyproject.toml with dependencies and tool config
3. Entry point file (main.py, cli.py, etc.)
4. Test structure with pytest config
5. Makefile, .env.example, .gitignore
