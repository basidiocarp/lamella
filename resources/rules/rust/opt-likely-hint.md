# opt-likely-hint

> Use code structure to hint at likely branches; use intrinsics on nightly

Express the common path clearly before reaching for explicit branch hints.

## Prefer

- structuring conditionals so the common case is straight-line code
- clear fast-path returns and isolated rare branches
- explicit branch hints only when the toolchain and profiling justify them

## Avoid

- readability loss for hypothetical branch prediction gains
- nightly-only hints in portable stable code without a strong reason
- branch hints before measuring whether branching is the problem

## See Also

- [opt-cold-unlikely](./opt-cold-unlikely.md) - Mark genuinely rare paths
- [perf-profile-first](./perf-profile-first.md) - Measure before optimizing
