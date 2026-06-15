# Property-Driven Development

Design features by defining properties upfront as executable specifications, before implementation.

## When to Use

- designing a new feature from scratch
- building something with clear algebraic properties
- domains where edge cases are likely
- situations where requirements need sharper validation

## Process

### Phase 1: Understand the Feature

Gather:
- purpose
- inputs and valid domain
- outputs and guarantees
- constraints and invariants
- boundary cases
- relationships such as inverse operations

### Phase 2: Identify Candidate Properties

| Question | Property Type | Example |
|----------|---------------|---------|
| Does it have an inverse operation? | Roundtrip | `decode(encode(x)) == x` |
| Is applying it twice the same as once? | Idempotence | `f(f(x)) == f(x)` |
| What quantities are preserved? | Invariants | Length, sum, count |
| Is order irrelevant? | Commutativity | `f(a, b) == f(b, a)` |
| Can operations be regrouped? | Associativity | `f(f(a,b), c) == f(a, f(b,c))` |
| Is there a neutral element? | Identity | `f(x, 0) == x` |

### Phase 3: Define Input Domain

Specify valid inputs as strategies. The strategy is part of the specification.

```python
@st.composite
def valid_registration_requests(draw):
    username = draw(st.text(min_size=3, max_size=20))
    password = draw(st.text(min_size=12, max_size=128))
    age = draw(st.integers(min_value=13, max_value=120))
    return RegistrationRequest(
        username=username,
        password=password,
        age=age,
    )
```

### Phase 4: Write Property Tests Before Implementation

```python
class TestFeatureSpec:
    @given(valid_inputs())
    def test_core_property(self, x):
        result = feature(x)
        assert property_holds(result)
```

### Phase 5: Iterate on Design

If a property feels awkward to state or test, it often exposes a design gap worth surfacing before implementation.

## Strategy Design Principles

1. build constraints into the strategy
2. match real-world constraints
3. include explicit edge cases with `@example`

## Red Flags

- tautological properties that restate implementation logic
- properties that start too strong before weak guarantees are proven
- strategies that rely on repeated `assume()`
- design questions ignored instead of clarified
