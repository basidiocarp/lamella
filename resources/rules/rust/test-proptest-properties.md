# test-proptest-properties

> Use proptest for property-based testing

Use `proptest` when examples are not enough to cover the invariant.

## Prefer

- property tests for parsers, serializers, math, state transitions, and normalization logic
- invariants and round trips stated in domain terms
- shrinking-friendly strategies that keep failures understandable

## Avoid

- property tests for behavior already fully proven by a few targeted examples
- gigantic input spaces with no useful shrinking story
- vague properties that only restate “does not crash”

## See Also

- [test-criterion-bench](./test-criterion-bench.md) - Measure performance separately from correctness
- [test-descriptive-names](./test-descriptive-names.md) - Keep tests readable even when generated
