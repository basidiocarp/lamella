# Python Sharp Edges

Use this reference when scanning Python for language features that turn small
convenience patterns into security or reliability hazards.

## Mutable Defaults

Default arguments are evaluated once at function definition time.

```python
def append_to(item, target=[]):
    target.append(item)
    return target
```

Safer pattern:

```python
def append_to(item, target=None):
    if target is None:
        target = []
    target.append(item)
    return target
```

Flag mutable defaults on `list`, `dict`, `set`, and custom objects.

## Dynamic Code Execution

Several built-ins turn data into code or shell behavior.

```python
eval(user_input)
exec(user_input)
code = compile(user_input, "<string>", "exec")
exec(code)
subprocess.run(f"ls {user_input}", shell=True)
```

Also treat these as high-risk:
- `pickle.loads`
- unsafe `yaml.load`
- dynamic import paths from untrusted input

## Closure Binding and Loop Reuse

Closures capture variables by reference, not by value.

```python
funcs = []
for i in range(3):
    funcs.append(lambda: i)
```

Safer pattern:

```python
funcs = []
for i in range(3):
    funcs.append(lambda i=i: i)
```

This matters anywhere handlers, callbacks, or deferred jobs are built in loops.

## Identity, Equality, and Shadowing

Python makes it easy to write code that works until implementation details
change.

```python
if x is 1:
    ...
```

Use `is` only for singletons such as `None`, `True`, and `False`.

Also flag local modules that shadow stdlib or dependency names, such as
`random.py`, `types.py`, or `email.py`.

## Exception Handling

Over-broad catches can hide both user errors and programmer mistakes.

```python
try:
    risky_operation()
except:
    pass
```

Watch for:
- bare `except`
- `except Exception:` without re-raise or narrowing
- error-swallowing log-only handlers
- cleanup code that can replace the original exception path

## Shared Mutability and Formatting

Two recurring footguns:

```python
class User:
    permissions = []

template = user_template
template.format(obj)
```

- mutable class attributes share state across instances
- user-controlled format strings can expose object attributes or structure

Prefer instance initialization and safe templating paths.

## Precision and Attribute Chains

Python will happily hide precision loss or crash late in deep access chains.

```python
0.1 + 0.2 == 0.3
result = api.get_user().profile.settings.theme
```

Flag:
- float equality in money or boundary logic
- integer-to-float coercion on large values
- long attribute chains without `None` handling
- unpacking of untrusted iterables into fixed arity

## Detection Checklist

| Pattern | Risk |
|---|---|
| `def f(x=[])` or `def f(x={})` | Shared mutable default |
| `eval(`, `exec(`, `compile(` | Code execution |
| `pickle.loads(`, unsafe `yaml.load(` | Deserialization RCE |
| `lambda: var` in loop | Late binding bug |
| `x is 1` or `x is "foo"` | Identity confusion |
| local file shadows import target | Import confusion |
| bare `except` or wide `except Exception` | Hidden failures |
| mutable class attributes | Shared state |
| user-controlled format template | Format injection |
| `subprocess.*(..., shell=True)` | Command injection |

Keep the detector focused on misuse patterns, not general Python style.
