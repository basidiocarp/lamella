---
name: rust-project-layout
description: Organize Rust crates, modules, visibility, workspaces, and internal public surfaces coherently. Use when restructuring crates, deciding on workspace boundaries, reviewing module layout, or tightening visibility and re-export policy.
origin: lamella
---

# Rust Project Layout

Use this skill when the problem is crate organization or module structure.

## Focus Areas

- crate and workspace boundaries
- module layout and re-exports
- visibility and internal API shaping
- project growth from small crate to multi-crate workspace

## Workflow

1. Start with the smallest structure that matches current scale.
2. Split by responsibility, not by habit.
3. Keep public surface and internal layout intentionally separate.
4. Centralize workspace policy only once multiple crates really share it.

## References

- load [references/project-layout.md](./references/project-layout.md) for crate-organization guidance
