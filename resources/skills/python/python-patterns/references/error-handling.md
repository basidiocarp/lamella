# Error Handling Patterns

Proper exception handling is critical for robust Python applications.

## Specific Exception Handling

```python
# Good: Catch specific exceptions
def load_config(path: str) -> Config:
    try:
        with open(path) as f:
            return Config.from_json(f.read())
    except FileNotFoundError as e:
        raise ConfigError(f"Config file not found: {path}") from e
    except json.JSONDecodeError as e:
        raise ConfigError(f"Config file is not valid JSON: {path}") from e

# Bad: catches everything and hides the root cause
def load_config_bad(path: str) -> Config | None:
    try:
        with open(path) as f:
            return Config.from_json(f.read())
    except:
        return None  # Silent failure!
```

## Exception Chaining

```python
def process_data(data: str) -> Result:
    try:
        parsed = json.loads(data)
    except json.JSONDecodeError as e:
        # Chain exceptions to preserve the traceback
        raise ValueError(f"Failed to parse data: {data}") from e
```

## Custom Exception Hierarchy

```python
class AppError(Exception):
    """Base exception for all application errors."""
    pass

class ValidationError(AppError):
    """Raised when user input or payload validation fails."""

class NotFoundError(AppError):
    """Raised when a requested entity does not exist."""

class PermissionDeniedError(AppError):
    """Raised when the caller lacks permission."""

def get_user(user_id: str) -> User:
    user = db.find_user(user_id)
    if not user:
        raise NotFoundError(f"User not found: {user_id}")
    return user
```

## Exception Handling Best Practices

| Practice | Description |
|----------|-------------|
| Be specific | Catch specific exceptions, not bare `except:` |
| Chain exceptions | Use `raise ... from e` to preserve traceback |
| Use hierarchy | Create application-specific exception classes |
| Log context | Include relevant context in error messages |
| Don't suppress | Avoid silent failures with empty `except` blocks |
| Re-raise appropriately | Convert low-level to domain exceptions |

## Common Exception Types

| Exception | Use Case |
|-----------|----------|
| `ValueError` | Invalid argument values |
| `TypeError` | Wrong argument types |
| `KeyError` | Missing dictionary keys |
| `AttributeError` | Missing object attributes |
| `FileNotFoundError` | Missing files |
| `RuntimeError` | Generic runtime errors |
| `NotImplementedError` | Abstract methods |
