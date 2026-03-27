# Comprehensions and Generators

Efficient iteration patterns for transformation and lazy evaluation.

## List Comprehensions

```python
names = [user.name for user in users if user.is_active]
```

## Dictionary and Set Comprehensions

```python
word_lengths = {word: len(word) for word in words}
unique_lengths = {len(word) for word in words}
```

## Generator Expressions

```python
total = sum(x * x for x in range(1_000_000))
active_emails = (u.email for u in users if u.is_active)
```

## Generator Functions

```python
def read_large_file(path: str) -> Iterator[str]:
    with open(path) as f:
        for line in f:
            yield line.strip()
```
