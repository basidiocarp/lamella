# Decorators

Decorators wrap functions or classes to add reusable behavior without rewriting
the target body.

## Common Uses

Good fits:
- caching
- retry logic
- validation
- timing or logging
- registration or dispatch

Use decorators when the cross-cutting behavior is truly reusable and the wrapped
function remains easy to understand.

## Function Decorators

The default pattern is:
- accept the function
- wrap it
- preserve metadata with `functools.wraps`

If `wraps` is missing, debugging and introspection become worse quickly.

## Parameterized Decorators

Use a decorator factory when the behavior needs configuration, such as retry
count or validation mode.

This adds an extra level of nesting, so keep the API small and predictable.

## Class-Based Decorators

Use class-based decorators only when the decorator itself needs state or richer
behavior. For most cases, function decorators are simpler.

## Built-In Decorators

Common built-ins:
- `@property`
- `@staticmethod`
- `@classmethod`
- `@functools.lru_cache`
- `@functools.singledispatch`
- `@contextlib.contextmanager`
- `@dataclasses.dataclass`

## Design Rule

If a decorator hides important control flow or makes the function’s real
behavior hard to see, it is probably the wrong abstraction.
