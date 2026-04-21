---
name: python-testing
description: "Applies pytest patterns and configuration for Python test suites."
origin: lamella
---

# Python Testing Patterns


## Contents

- [pytest Configuration](#pytest-configuration)
- [Fixture Scopes](#fixture-scopes)
- [Parametrized Fixtures](#parametrized-fixtures)
- [Mocking Patterns](#mocking-patterns)
- [Async Testing](#async-testing)
- [Built-in Fixtures](#built-in-fixtures)
- [Test Selection](#test-selection)
- [conftest.py](#conftestpy)
- [Gotchas](#gotchas)

Standard pytest syntax is assumed. This skill covers setup, fixtures, mocking, and configuration.

## Installation

```bash
pip install pytest pytest-cov
```

## pytest Configuration

### pyproject.toml

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = [
    "--strict-markers",
    "--cov=mypackage",
    "--cov-report=term-missing",
    "--cov-fail-under=80",
]
markers = [
    "slow: marks tests as slow",
    "integration: marks tests as integration",
]
```

## Fixture Scopes

```python
@pytest.fixture                 # function - each test (default)
@pytest.fixture(scope="class")  # class - once per test class
@pytest.fixture(scope="module") # module - once per file
@pytest.fixture(scope="session")# session - once per run
```

## Parametrized Fixtures

```python
@pytest.fixture(params=["sqlite", "postgresql"])
def db(request):
    return Database(request.param)

def test_query(db):  # runs 2x, once per param
    assert db.query("SELECT 1")
```

## Mocking Patterns

### Basic Patch

```python
@patch("mypackage.external_api")
def test_api(api_mock):
    api_mock.return_value = {"status": "ok"}
    result = my_function()
    api_mock.assert_called_once()
```

### Mock Side Effects

```python
api_mock.side_effect = [{"page": 1}, {"page": 2}, StopIteration]
api_mock.side_effect = ConnectionError("Network error")
```

### Autospec (Prevents Typos)

```python
@patch("mypackage.Service", autospec=True)
def test_service(service_mock):
    # Fails if Service doesn't have the method
    service_mock.return_value.process.return_value = "done"
```

### Mock Context Managers

```python
from unittest.mock import mock_open

@patch("builtins.open", mock_open(read_data="content"))
def test_file_read(mock_file):
    result = read_file("test.txt")
```

## Async Testing

```python
import pytest

@pytest.mark.asyncio
async def test_async_call():
    result = await async_function()
    assert result == "expected"

@pytest.fixture
async def async_client():
    async with AsyncClient() as client:
        yield client
```

## Built-in Fixtures

| Fixture | Purpose |
|---------|---------|
| `tmp_path` | Path to temp directory (cleaned up) |
| `tmp_path_factory` | Create multiple temp dirs |
| `capsys` | Capture stdout/stderr |
| `caplog` | Capture log messages |
| `monkeypatch` | Modify objects/env vars safely |
| `request` | Access fixture metadata |

### monkeypatch Examples

```python
def test_env_var(monkeypatch):
    monkeypatch.setenv("API_KEY", "test-key")
    monkeypatch.setattr("mypackage.config.DEBUG", True)
    monkeypatch.delattr("mypackage.optional_feature")
```

## Test Selection

```bash
pytest -m "not slow"           # exclude slow
pytest -m "integration"        # only integration
pytest -k "test_user"          # name pattern
pytest --lf                    # last failed only
pytest -x                      # stop on first failure
pytest --pdb                   # debugger on failure
```

## conftest.py

```python
# tests/conftest.py - auto-discovered
@pytest.fixture(autouse=True)
def reset_state():
    Config.reset()
    yield
    Config.cleanup()

@pytest.fixture
def client():
    app = create_app(testing=True)
    return app.test_client()
```

## Gotchas

| Issue | Problem | Solution |
|-------|---------|----------|
| Fixture not found | Wrong scope or file | Check conftest.py location |
| Mock not working | Wrong patch path | Patch where used, not defined |
| Async test hangs | Missing marker | Add `@pytest.mark.asyncio` |
| Tests affect each other | Shared state | Use fixtures with proper scope |
| Coverage seems low | Missing `__init__.py` | Add init files to packages |
