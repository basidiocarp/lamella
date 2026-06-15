---
name: rust-advanced
description: "Guides advanced Rust implementation work."
origin: lamella
---

# Advanced Rust Development

Guidance for advanced Rust work that spans ownership, async execution, trait design, performance, and API ergonomics.

## Scope

Covers Rust 2024, async programming with tokio, trait-based design, and performance-aware implementation. Focus on memory-safe concurrent systems with clear APIs and explicit trade-offs.

## When to Use This Skill

- Building systems-level applications in Rust
- Implementing ownership and borrowing patterns
- Designing trait hierarchies and generic APIs
- Setting up async/await with tokio or async-std
- Optimizing for performance and memory safety
- Creating FFI bindings and unsafe abstractions

## Core Workflow

1. **Analyze ownership** - Design lifetime relationships and borrowing patterns
2. **Design traits** - Create trait hierarchies with generics and associated types
3. **Implement safely** - Write idiomatic Rust with minimal unsafe code
4. **Handle errors** - Use Result/Option with ? operator and custom error types
5. **Test thoroughly** - Unit tests, integration tests, property testing, benchmarks

## Related Skills

Load the focused skill that matches the bottleneck:

| Topic | Skill | Load When |
|-------|-------|-----------|
| Ownership and lifetimes | `ownership` | Lifetimes, borrowing, moved values, clone trade-offs |
| Smart pointers | `resource-mgmt` | Box, Rc, Arc, Weak, RefCell, Cell |
| Mutability | `mutability` | Borrow conflicts, interior mutability, mutable aliasing |
| Generics and traits | `zero-cost` | Trait bounds, object safety, dispatch choices |
| Async and threading | `concurrency` | Send or Sync, async runtimes, channels, locks |
| Unsafe code | `unsafe-checker` | FFI, raw pointers, transmute, SAFETY invariants |
| Latest crate or Rust info | `rust-learner` | Versions, changelogs, docs.rs, edition questions |

## Constraints

### MUST DO
- Use ownership and borrowing for memory safety
- Minimize unsafe code (document all unsafe blocks)
- Use type system for compile-time guarantees
- Handle all errors explicitly (Result/Option)
- Add comprehensive documentation with examples
- Run clippy and fix all warnings
- Use cargo fmt for consistent formatting
- Write tests including doctests

### MUST NOT DO
- Use unwrap() in production code (prefer expect() with messages)
- Create memory leaks or dangling pointers
- Use unsafe without documenting safety invariants
- Ignore clippy warnings
- Mix blocking and async code incorrectly
- Skip error handling
- Use String when &str suffices
- Clone unnecessarily (use borrowing)

## Output Templates

When implementing Rust features, provide:
1. Type definitions (structs, enums, traits)
2. Implementation with proper ownership
3. Error handling with custom error types
4. Tests (unit, integration, doctests)
5. Brief explanation of design decisions

## Knowledge Reference

Rust 2024, Cargo, ownership and borrowing, lifetimes, traits, generics, async and await, tokio, Result and Option, thiserror and anyhow, serde, clippy, rustfmt, cargo test, criterion benchmarks, Miri, unsafe Rust
