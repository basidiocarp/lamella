# Memory and Performance

Optimization patterns for efficient Python code.

## Using __slots__ for Memory Efficiency

```python
# Bad: Regular class uses __dict__ (more memory)
class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

# Good: __slots__ reduces memory usage
class Point:
    __slots__ = ['x', 'y']

    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
```

Memory savings can be 40-50% for classes with few attributes and many instances.

## Generator for Large Data

```python
# Bad: Returns full list in memory
def read_lines(path: str) -> list[str]:
    with open(path) as f:
        return [line.strip() for line in f]

# Good: Yields lines one at a time
def read_lines(path: str) -> Iterator[str]:
    with open(path) as f:
        for line in f:
            yield line.strip()
```

## Avoid String Concatenation in Loops

```python
# Bad: O(n²) due to string immutability
result = ""
for item in items:
    result += str(item)

# Good: O(n) using join
result = "".join(str(item) for item in items)

# Good: Using StringIO for building
from io import StringIO

buffer = StringIO()
for item in items:
    buffer.write(str(item))
result = buffer.getvalue()
```

## Use Built-in Functions

```python
# Bad: Manual implementation
total = 0
for x in numbers:
    total += x

// ... (8 lines trimmed)

# Good: Built-in min
smallest = min(numbers)
```

## Dictionary Operations

```python
# Bad: Checking key then accessing
if key in dictionary:
    value = dictionary[key]
else:
    value = default
// ... (10 lines trimmed)
# Better: Use collections.Counter
from collections import Counter
counts = Counter(items)
```

## Local Variable Optimization

```python
# Slightly faster: local variable for repeated access
def process(items):
    # Cache method lookup
    append = result.append
    for item in items:
        append(transform(item))
```

## Profiling Tools

| Tool | Purpose | Usage |
|------|---------|-------|
| `cProfile` | CPU profiling | `python -m cProfile script.py` |
| `timeit` | Micro-benchmarks | `python -m timeit "code"` |
| `memory_profiler` | Memory usage | `@profile` decorator |
| `line_profiler` | Line-by-line timing | `kernprof -l script.py` |
| `py-spy` | Sampling profiler | `py-spy top --pid PID` |

## Quick Wins

| Pattern | Benefit |
|---------|---------|
| Use `__slots__` | 40-50% memory reduction |
| Generators | Constant memory for large data |
| `str.join()` | O(n) vs O(n²) concatenation |
| List comprehensions | Faster than explicit loops |
| Built-in functions | C-optimized implementations |
| Local variables | Avoid repeated lookups |
