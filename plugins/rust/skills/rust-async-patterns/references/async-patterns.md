# Rust Async Patterns Reference

Relevant source rule group:

- `resources/rules/rust/async-*.md`

Use this reference for:

- `JoinSet`, `join!`, `try_join!`, `select!`
- `mpsc`, `oneshot`, `watch`, `broadcast`
- `CancellationToken`, shutdown flow, `spawn_blocking`
- Tokio runtime and async filesystem choices

The core rules keep only the highest-signal async guidance. Use this reference
when the implementation question is specifically about async coordination.
