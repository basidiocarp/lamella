# Comprehensions and Generators

Efficient iteration patterns for data transformation and lazy evaluation.

## List Comprehensions

```python
# Good: List comprehension for simple transformations
names = [user.name for user in users if user.is_active]

# Bad: Manual loop
names = []
// ... (12 lines trimmed)
        if x > 0 and x % 2 == 0:
            result.append(x * 2)
    return result
```

## Dictionary and Set Comprehensions

```python
# Dictionary comprehension
word_lengths = {word: len(word) for word in words}

# Set comprehension
unique_lengths = {len(word) for word in words}

# Conditional dictionary comprehension
active_users = {u.id: u.name for u in users if u.is_active}
```

## Generator Expressions

```python
# Good: Generator for lazy evaluation
total = sum(x * x for x in range(1_000_000))

# Bad: Creates large intermediate list
total = sum([x * x for x in range(1_000_000)])

# Generator for filtering
active_emails = (u.email for u in users if u.is_active)
```

## Generator Functions

```python
def read_large_file(path: str) -> Iterator[str]:
    """Read a large file line by line."""
    with open(path) as f:
        for line in f:
            yield line.strip()

# Usage
for line in read_large_file("huge.txt"):
    process(line)
```

## Advanced Generator Patterns

```python
def chunked(iterable: Iterable[T], size: int) -> Iterator[list[T]]:
    """Yield chunks of the specified size."""
    chunk = []
    for item in iterable:
        chunk.append(item)
        if len(chunk) == size:
            yield chunk
            chunk = []
    if chunk:
        yield chunk

# Generator delegation with yield from
def flatten(nested: Iterable[Iterable[T]]) -> Iterator[T]:
    for inner in nested:
        yield from inner
```

## When to Use Each

| Pattern | Use Case |
|---------|----------|
| List comprehension | Small-medium transformations, need indexed access |
| Generator expression | Large data, single iteration, memory efficiency |
| Generator function | Complex logic, multiple yields, stateful iteration |
| Dict comprehension | Key-value transformations |
| Set comprehension | Unique value collection |
