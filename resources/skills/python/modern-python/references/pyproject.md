# pyproject.toml Configuration Reference

Complete reference for configuring `pyproject.toml` for modern Python projects.

**Important**: Always use `uv add` and `uv remove` to manage dependencies. Do not edit the `dependencies` or `dependency-groups` sections directly.

## Complete Example

```toml
[project]
name = "myproject"
version = "0.1.0"
description = "A modern Python project"
readme = "README.md"
// ... (82 lines trimmed)
    "if TYPE_CHECKING:",
    "if __name__ == .__main__.:",
]
```

## Section Reference

### [project]

Core project metadata following PEP 621.

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Package name (lowercase, hyphens) |
| `version` | Yes | Semantic version |
| `description` | No | One-line description |
| `readme` | No | Path to README file |
| `license` | No | SPDX license identifier |
| `requires-python` | Recommended | Python version constraint |
| `authors` | No | List of author dicts |
| `dependencies` | No | Runtime dependencies |

### [project.optional-dependencies]

**Rarely needed.** Only use for optional *runtime* features that end users install:

```toml
[project.optional-dependencies]
# User installs with: uv add myproject[postgres]
postgres = ["psycopg2"]
```

**Do NOT use for dev tools**—use `[dependency-groups]` instead.

### [project.scripts]

Console entry points:

```toml
[project.scripts]
myproject = "myproject.cli:main"
myproject-serve = "myproject.server:run"
```

### [build-system]

Build backend configuration. Use `uv_build` for most projects:

```toml
[build-system]
requires = ["uv_build>=0.9,<1"]  # Use latest 0.x; check https://pypi.org/project/uv-build/
build-backend = "uv_build"
```

`uv_build` is simpler and sufficient for most use cases. Use static versioning in `[project] version` rather than VCS-aware dynamic versioning.

For flat layout (no `src/` directory), configure the module root:

```toml
[tool.uv.build-backend]
module-root = ""
```

> **Note:** These tools evolve rapidly. Prefer `>=X.Y,<X+1` constraints to automatically get newer releases within the same major version.

### [dependency-groups]

Development dependencies (PEP 735). Unlike optional-dependencies, these are NOT installed by users:

```toml
[dependency-groups]
dev = [{include-group = "lint"}, {include-group = "test"}, {include-group = "audit"}]
lint = ["ruff", "ty"]
test = ["pytest", "pytest-cov"]
audit = ["pip-audit"]
docs = ["sphinx", "myst-parser"]
```

Install with: `uv sync --group dev --group test`

### [tool.uv]

uv-specific configuration:

```toml
[tool.uv]
# Default groups to install with `uv sync`
default-groups = ["dev", "test"]

# Python version management
python-preference = "managed"
```

## Version Specifiers

| Specifier | Meaning |
|-----------|---------|
| `>=1.0` | At least version 1.0 |
| `>=1.0,<2.0` | Version 1.x only |
| `~=1.4` | Compatible release (>=1.4, <2.0) |
| `==1.4.*` | Any 1.4.x version |

## uv.lock Handling

| Project Type | uv.lock in Git? | Why |
|--------------|-----------------|-----|
| Application | ✅ Commit | Reproducible deploys |
| Library | ❌ .gitignore | Users resolve their own deps |

## Common Patterns

### Library Package

```toml
[project]
dependencies = []  # Minimal runtime deps

[project.optional-dependencies]
# Optional runtime features (user installs with mylib[async])
async = ["httpx"]

[dependency-groups]
dev = ["ruff", "ty"]
test = ["pytest", "pytest-cov"]
```

### Application Package

```toml
[project]
dependencies = [
    "fastapi",
    "uvicorn",
    "sqlalchemy",
]

[project.scripts]
myapp = "myapp.main:run"

[dependency-groups]
dev = ["ruff", "ty", "pytest"]
```

### CLI Tool

```toml
[project]
dependencies = [
    "typer",
    "rich",
]

[project.scripts]
mytool = "mytool.cli:app"

[dependency-groups]
dev = ["ruff", "ty", "pytest"]
```
