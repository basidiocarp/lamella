# Project Setup and Tooling

Standard project structure, imports, and development tools.

## Standard Project Layout

```
myproject/
├── src/
│   └── mypackage/
│       ├── __init__.py
│       ├── main.py
// ... (14 lines trimmed)
├── pyproject.toml
├── README.md
└── .gitignore
```

## Import Conventions

```python
# Good: Import order - stdlib, third-party, local
import os
import sys
from pathlib import Path

import requests
from fastapi import FastAPI

from mypackage.models import User
from mypackage.utils import format_name

# Use isort for automatic import sorting
# pip install isort
```

## __init__.py for Package Exports

```python
# mypackage/__init__.py
"""mypackage - A sample Python package."""

__version__ = "1.0.0"

# Export main classes/functions at package level
from mypackage.models import User, Post
from mypackage.utils import format_name

__all__ = ["User", "Post", "format_name"]
```

## Essential Commands

```bash
# Code formatting
black .
isort .

# Linting
// ... (12 lines trimmed)
# Dependency management
pip-audit
safety check
```

## pyproject.toml Configuration

```toml
[project]
name = "mypackage"
version = "1.0.0"
requires-python = ">=3.9"
dependencies = [
// ... (27 lines trimmed)
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "--cov=mypackage --cov-report=term-missing"
```

## Recommended Tools

| Tool | Purpose | Command |
|------|---------|---------|
| black | Code formatting | `black .` |
| isort | Import sorting | `isort .` |
| ruff | Fast linting | `ruff check .` |
| mypy | Type checking | `mypy .` |
| pytest | Testing | `pytest` |
| bandit | Security | `bandit -r .` |
| pip-audit | Dependency audit | `pip-audit` |
