# opt-cache-friendly

> Organize data for cache-efficient access patterns

Optimize layout for locality only when memory access is the bottleneck.

## Prefer

- contiguous access patterns in hot loops
- hot/cold splitting when frequently touched data is mixed with rarely used fields
- layout changes justified by profiling or memory access evidence

## Avoid

- data-layout rewrites before measuring cache behavior
- pointer-heavy structures when dense indexed storage would work
- making APIs much harder to use for speculative locality gains

## See Also

- [mem-box-large-variant](./mem-box-large-variant.md) - Shrink large enum layouts when it helps
- [perf-profile-first](./perf-profile-first.md) - Measure before optimizing
