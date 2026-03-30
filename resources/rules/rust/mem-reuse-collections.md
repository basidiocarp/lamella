# mem-reuse-collections

> Clear and reuse collections instead of creating new ones in loops

Reuse existing buffers when repeated iterations share the same temporary shape.

## Prefer

- `clear`, `truncate`, or in-place reset when capacity reuse matters
- loop-scoped reusable scratch buffers for hot repeated work
- fresh allocations when ownership must escape each iteration

## Avoid

- rebuilding the same scratch `Vec`, `String`, or `HashMap` every pass
- reusing buffers across iterations when it complicates correctness or ownership
- assuming reuse is always faster without checking actual allocation pressure

## See Also

- [mem-with-capacity](./mem-with-capacity.md) - Preallocate buffers intentionally
- [perf-drain-reuse](./perf-drain-reuse.md) - Reuse map or vec storage efficiently
