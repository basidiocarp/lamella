---
name: rust-async-patterns
description: Design and review Rust async code beyond the always-on core rules. Use when working on Tokio runtime choices, channels, task orchestration, cancellation, blocking boundaries, or async coordination patterns.
origin: lamella
---

# Rust Async Patterns

Use this skill for async design and runtime orchestration questions that go
beyond the core no-lock-across-await rule.

## Focus Areas

- task orchestration and shutdown
- channels and work distribution
- runtime and blocking boundaries
- racing, joining, and cancellation patterns

## Workflow

1. Confirm whether the problem is coordination, ownership, or runtime choice.
2. Pick the narrowest async primitive that matches the data flow.
3. Keep cancellation and shutdown behavior explicit.
4. Use bounded concurrency unless unbounded work is truly intended.

## References

- load [references/async-patterns.md](./references/async-patterns.md) when the async pattern itself is the question
