# Legacy Testing Strategies

Use this reference to choose the lightest testing strategy that still creates a
safe modernization envelope.

## Strategy Matrix

| Strategy | Use When | Main Risk |
| --- | --- | --- |
| Characterization tests | current behavior is unclear but must be preserved | locking in a known bug without documenting it |
| Golden master or snapshot tests | outputs are broad or formatting-heavy | brittle approvals if noise is not controlled |
| Parallel run comparison | old and new implementations can run side by side | drift if inputs are not identical |
| Mutation or property-based tests | edge cases are unclear | noisy failures if invariants are weak |
| Coverage-guided targeting | the system has many blind spots | chasing coverage numbers instead of risky paths |

## Core Rules

- Start by capturing behavior before refactoring the internals.
- Prefer high-signal tests around risky flows over blanket low-value coverage.
- Note known bugs explicitly when characterization tests preserve them.
- Keep snapshot and golden-master inputs deterministic.

## Minimal Example

```python
def test_legacy_shipping_characterization():
    order = {"weight": 11, "destination": "domestic", "priority": True}
    assert calculate_shipping_cost(order) == 17.50
```

That kind of test is enough to pin down behavior before the code starts moving.
