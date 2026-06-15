# Replace Algorithm Pattern

Use this pattern when the legacy implementation is correct enough to keep
temporarily, but too slow, brittle, or costly to leave in place.

## Steps

1. define a stable contract around the old algorithm
2. capture current behavior with characterization tests
3. add the new algorithm behind the same interface
4. compare correctness and latency under production-like data
5. cut over gradually if output differences are acceptable
