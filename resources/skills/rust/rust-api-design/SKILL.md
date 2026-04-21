---
name: rust-api-design
description: Design Rust APIs with the right defaults for boundaries, naming, builders, typed values, and public contract stability. Use when shaping public APIs, reviewing ergonomics, choosing between enums/newtypes/builders, or when naming and type design questions matter.
origin: lamella
---

# Rust API Design

Use this skill when the question is about API shape, not just compiler mechanics.

## Focus Areas

- boundary parsing and validated types
- builder design and `#[must_use]`
- public type design, naming, and conversion conventions
- forward compatibility for public APIs

## Workflow

1. Identify the caller-facing contract first.
2. Prefer the smallest type surface that prevents likely misuse.
3. Keep ownership and conversion costs obvious in names and signatures.
4. Preserve room for future evolution without overengineering the API.

## References

- load [references/api-design.md](./references/api-design.md) for the detailed rule map
