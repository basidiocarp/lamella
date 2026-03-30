# lint-warn-perf

> Warn on clippy perf lints in mature codebases

Performance lints are useful signals, but they are still secondary to measured
hotspots.

## Prefer

- warning-level perf lints to catch obvious inefficiencies
- profiling before larger optimization work
- suppressing false positives narrowly with a reason

## Avoid

- treating every perf lint as a mandatory change
- ignoring consistent perf warnings in hot code
- using lint output as a substitute for measurement

## See Also

- [perf-profile-first](./perf-profile-first.md) - Measure before optimizing
- [lint-workspace-lints](./lint-workspace-lints.md) - Keep lint policy centralized
