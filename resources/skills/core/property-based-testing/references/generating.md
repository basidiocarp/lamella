# Generating Property-Based Tests

How to create complete, runnable property-based tests.

## Process

1. analyze the target function
2. design input strategies
3. identify applicable properties
4. generate test code
5. add explicit edge cases

## Property Reference

| Property | When to Use | Test Pattern |
|----------|-------------|--------------|
| Roundtrip | encode/decode pairs | `assert decode(encode(x)) == x` |
| Idempotence | normalization, sorting | `assert f(f(x)) == f(x)` |
| Invariant | any transformation | `assert invariant(f(x))` |
| No exception | weak baseline | function completes without raising |
| Type preservation | typed functions | `assert isinstance(f(x), ExpectedType)` |
| Oracle | reference implementation exists | `assert f(x) == reference_impl(x)` |

## Complete Example

```python
from hypothesis import given, strategies as st, settings, example

@given(st.lists(st.integers()))
@example([])
@example([1])
@example([1, 1, 1])
@settings(max_examples=100)
def test_sort_properties(xs):
    result = sort(xs)
    assert len(result) == len(xs)
    assert sorted(result) == sorted(xs)
    assert all(result[i] <= result[i + 1] for i in range(len(result) - 1))
    assert sort(result) == result
```

## Running Tests

```bash
pytest test_file.py -v
pytest test_file.py --hypothesis-show-statistics
```

## Checklist Before Finishing

- tests are not tautological
- at least one strong property exists
- edge cases are covered with `@example`
- strategies are realistic
- settings match the intended context

## When Tests Fail

See [interpreting-failures.md](interpreting-failures.md) to decide whether the failure is a genuine bug, a bad property, or an ambiguous specification.
