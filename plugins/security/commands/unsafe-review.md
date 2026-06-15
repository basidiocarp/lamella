---
description: Review unsafe Rust and FFI code for soundness risks, with optional quick-check mode
argument-hint: "[path-or-symbol] [--quick]"
---

# Unsafe Review

Review unsafe Rust or FFI code using the `unsafe-checker` skill. Use `--quick` for a fast single-pass audit, or omit it for a fuller review.

If the target is not specified, infer the most relevant Rust file from the current task or ask the user which file or module to review.

## Workflow

1. Identify the target file, module, or unsafe item.
2. Load [`resources/skills/rust/unsafe-checker/`](../../skills/rust/unsafe-checker/SKILL.md).
3. Enumerate:
   - `unsafe` blocks
   - `unsafe fn`
   - `unsafe impl`
   - FFI boundaries and raw pointer handling
4. Check each item for the relevant invariants.
5. Produce a concise report with severity, rationale, and concrete fixes.

## Quick Mode

When `--quick` is present:
- do a fast pass over the target file
- highlight only the highest-signal risks
- prioritize missing `// SAFETY:` notes, FFI panic boundaries, pointer validity, layout assumptions, and `Send` or `Sync` soundness

## Full Review Mode

When `--quick` is not present:
- review each unsafe item one by one
- explain the claimed invariant
- verify whether the surrounding code actually establishes it
- call out evidence gaps, not just missing comments

## Checklist Categories

### Surface-Level

- SAFETY comments present and meaningful
- Safety documentation for `unsafe fn`
- Unsafe blocks minimized

### Memory Safety

- Pointer validity: non-null, aligned, and live
- No aliasing violations
- No use-after-free or double-free
- Bounds and length assumptions

### Type Safety

- Valid transmutes and casts
- Correct enum discriminants
- Appropriate `repr` attributes

### Concurrency

- `Send` and `Sync` correctness
- Shared-state invariants
- Required synchronization

### FFI

- ABI compatibility
- Panic handling across the boundary
- Error handling
- Memory ownership and cleanup

## Output

Use this structure:

1. Scope reviewed
2. Summary status: `PASS`, `WARN`, or `FAIL`
3. Findings by location
4. Suggested remediations
5. Follow-up checks or tests

For each finding, include:
- location
- unsafe construct
- claimed invariant
- issue or verification result
- recommended next step

## Related

- [`/guideline`](../database/guideline.md) for rule lookup
