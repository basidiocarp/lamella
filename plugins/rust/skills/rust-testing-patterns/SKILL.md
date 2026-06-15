---
name: rust-testing-patterns
description: Design Rust tests with the right split between unit, integration, doctest, async, property, mock, and benchmark coverage. Use when adding tests, choosing test style, or reviewing whether evidence matches the behavior claim.
origin: lamella
---

# Rust Testing Patterns

Use this skill when the main question is which kind of test to write or how to
structure evidence.

## Focus Areas

- unit vs integration tests
- doctests and examples
- mocks, fakes, fixtures, and property tests
- async and benchmark coverage

## Workflow

1. Choose the narrowest test that proves the behavior claim.
2. Keep examples executable when they are part of the API surface.
3. Prefer real systems in integration tests and isolated seams in unit tests.
4. Let benchmark and property testing answer the questions they are actually good at.

## References

- load [references/testing-patterns.md](./references/testing-patterns.md) for the detailed test matrix
