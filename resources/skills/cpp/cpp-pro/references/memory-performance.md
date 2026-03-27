# Memory Management & Performance

This reference now routes by optimization concern instead of packing ownership, allocation, SIMD, and cache behavior into one partial example sheet.

## Reference Map

| Need | Load |
|------|------|
| Smart pointers, move semantics, forwarding, and RVO | [ownership-and-moves.md](ownership-and-moves.md) |
| Custom allocators, pools, and allocation strategy | [allocators-and-pools.md](allocators-and-pools.md) |
| SIMD, cache-friendly layout, and alignment | [simd-and-layout.md](simd-and-layout.md) |

## Triage

- If the problem is correctness and ownership clarity, start with `ownership-and-moves.md`.
- If profiling shows allocator overhead or churn, load `allocators-and-pools.md`.
- If the workload is numeric, batch-oriented, or cache-bound, load `simd-and-layout.md`.

## Rules of Thumb

- Profile before changing layout or introducing custom allocation.
- Prefer clearer ownership semantics first; performance work is easier once lifetimes are explicit.
- Reserve custom allocators and manual alignment for measured hotspots, not general application code.
