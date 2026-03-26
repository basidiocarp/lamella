---
name: rust-router
description: "Routes Rust questions to the right local skill. Use when triaging Rust compile errors, ownership and lifetime problems, async issues, unsafe code, or crate and release lookups."
metadata:
  globs:
    - '**/Cargo.toml'
    - '**/*.rs'
---

# Rust Question Router


## Contents

- [Routing Model](#routing-model)
- [Instructions for Claude](#instructions-for-claude)
- [Default Project Settings](#default-project-settings)
- [Skill Routing Table](#skill-routing-table)
- [Error Code Routing](#error-code-routing)
- [Functional Routing Table](#functional-routing-table)
- [Priority Order](#priority-order)
- [Keyword Conflict Resolution](#keyword-conflict-resolution)
- [Sub-Files Reference](#sub-files-reference)


> Context optimized. Detailed examples and negotiation notes live in the bundled sub-files.

## Routing Model

Answer through the narrowest Rust skill that matches the failure mode. When the question spans multiple layers, load the focused skill first, then add `rust-advanced` or `meta-cognition-parallel` for synthesis.

### Routing by Entry Point

| User Signal | Entry Layer | Direction | First Skill |
|-------------|-------------|-----------|-------------|
| E0xxx error | Language mechanics | Start focused | See error table below |
| Compile error | Layer 1 | Trace UP ↑ | Error table below |
| "How should I design..." | Design trade-off | Start broad | `rust-advanced` |
| "Compare..." or "best practice..." | Multi-perspective | Synthesize | `meta-cognition-parallel` |
| Latest crate, docs, or release info | Research | Look up | `rust-learner` |
| Domain-heavy question | Mixed | Combine | Rust skill + relevant domain skill |

## INSTRUCTIONS FOR CLAUDE

Use `meta-cognition-parallel` when the user asks for comparison, best practices, or a domain-sensitive architectural trade-off. Use a direct focused skill for concrete compiler errors and specific API questions.

## Default Project Settings

When creating new Rust projects or Cargo.toml files, ALWAYS use:

```toml
[package]
edition = "2024"  # ALWAYS use latest stable edition
rust-version = "1.85"

[lints.rust]
unsafe_code = "warn"

[lints.clippy]
all = "warn"
pedantic = "warn"
```

---

## Skill Routing Table

| Pattern | Route To |
|---------|----------|
| move, borrow, lifetime, E0382, E0597 | `ownership` |
| Box, Rc, Arc, RefCell, Cell, Weak | `resource-mgmt` |
| mut, interior mutability, E0499, E0502, E0596 | `mutability` |
| generic, trait, impl, dyn, monomorphization | `zero-cost` |
| Send, Sync, thread, async, channel, tokio | `concurrency` |
| RAII, Drop, connection lifecycle, OnceLock | `lifecycle` |
| unsafe, FFI, extern, raw pointer, transmute | **unsafe-checker** |
| broad implementation or design guidance | `rust-advanced` |
| comparative or cross-layer reasoning | `meta-cognition-parallel` |
| latest crate, docs, versions, editions | `rust-learner` |

---

## Error Code Routing

| Error Code | Route To | Common Cause |
|------------|----------|--------------|
| E0382 | `ownership` | Use of moved value |
| E0597 | `ownership` | Lifetime too short |
| E0506 | `ownership` | Cannot assign to borrowed |
| E0507 | `ownership` | Cannot move out of borrowed |
| E0515 | `ownership` | Return local reference |
| E0716 | `ownership` | Temporary value dropped |
| E0106 | `ownership` | Missing lifetime specifier |
| E0596 | `mutability` | Cannot borrow as mutable |
| E0499 | `mutability` | Multiple mutable borrows |
| E0502 | `mutability` | Borrow conflict |
| E0277 | `zero-cost` or `concurrency` | Trait bound or thread-safety issue |
| E0308 | `zero-cost` | Type mismatch |
| E0599 | `zero-cost` | No method found |
| E0038 | `zero-cost` | Trait not object-safe |
| E0433 | `rust-learner` | Missing crate or module information |

---

## Functional Routing Table

| Pattern | Route To | Action |
|---------|----------|--------|
| latest version, what's new | **rust-learner** | Use agents |
| API, docs, documentation | **rust-learner** | Browse official docs |
| code style, naming, clippy | **rust-advanced** | Apply project conventions |
| unsafe code, FFI | **unsafe-checker** | Read skill |
| code review or deeper audit | **unsafe-checker** or **rust-advanced** | Add `/audit` guidance when useful |

---

## Priority Order

1. **Identify cognitive layer** (L1/L2/L3)
2. **Load the narrowest matching skill**
3. **Add `rust-advanced` or `meta-cognition-parallel` only if needed**
4. **Cross-reference another plugin only when the domain truly matters**
5. **Answer with reasoning chain**

## Keyword Conflict Resolution

| Keyword | Resolution |
|---------|------------|
| `unsafe` | **unsafe-checker** |
| `error` | **ownership**, **mutability**, or **zero-cost** based on the code |
| `RAII` | **lifecycle** for design, **resource-mgmt** for pointer choice |
| `crate` | **rust-learner** |
| `tokio` | **concurrency** for runtime concepts, **rust-learner** for API docs |

**Priority Hierarchy:**

```
1. Error codes (E0xxx) → Direct lookup, highest priority
2. Comparative or best-practice questions → `meta-cognition-parallel`
3. Domain keywords + Rust failure mode → combine the Rust skill with the relevant domain skill
4. Specific crate keywords → `rust-learner`
5. General implementation questions → `rust-advanced`
```

---

## Sub-Files Reference

| File | Content |
|------|---------|
| `patterns/negotiation.md` | Negotiation protocol details |
| `examples/workflow.md` | Workflow examples |
| `integrations/os-checker.md` | Audit command guidance |
