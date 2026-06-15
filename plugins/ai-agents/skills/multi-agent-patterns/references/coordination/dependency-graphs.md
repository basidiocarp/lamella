# Dependency Graph Patterns

## Fully Independent (Maximum Parallelism)

```
A ─┐
B ─┼─→ Integration
C ─┘
```

All tasks run simultaneously. Risk: integration may reveal incompatibilities late.

## Diamond (Shared Foundation)

```
       ┌→ B ─┐
A ──→  ┤     ├→ D
       └→ C ─┘
```

B and C parallel after A. A is a bottleneck. TaskCreate: B,C blockedBy A; D blockedBy B,C.

## Fork-Join (Phased)

```
Phase 1:  A1, A2, A3  (parallel)
Phase 2:  B1, B2      (parallel, after phase 1)
Phase 3:  C1          (after phase 2)
```

Sync points between phases add delay but ensure consistency.

## Anti-Patterns

- Circular: A -> B -> C -> A. Deadlock. Fix: extract shared dependency.
- Unnecessary: A -> B where B doesn't need A's output. Fix: remove blockedBy.
- Star bottleneck: Everything depends on A. Fix: parallelize A's work or remove false dependencies.
