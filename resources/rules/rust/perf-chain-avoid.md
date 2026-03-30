# perf-chain-avoid

> Avoid `chain` in hot loops

Avoid iterator chaining patterns in measured hot paths when a flatter structure
is simpler for the optimizer.

## Prefer

- straightforward loops or dedicated iterators in hot code
- iterator combinators when readability is the main concern and performance is fine
- profiling before rewriting ergonomic iterator code

## Avoid

- flattening every iterator pipeline preemptively
- micro-optimizing combinators outside the hotspot
- losing clarity for negligible gains

## See Also

- [perf-iter-lazy](./perf-iter-lazy.md) - Keep iterator pipelines lazy until materialization is needed
- [perf-profile-first](./perf-profile-first.md) - Measure before optimizing
