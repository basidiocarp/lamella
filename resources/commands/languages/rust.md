---
description: "Rust development commands — check, review, project, news, features"
argument-hint: "<subcommand> [args] — subcommands: check, review, project, news, features"
---

# Rust Command

Rust-specific development workflow commands.

## Subcommands

| Subcommand | Purpose |
|------------|---------|
| `check` | 3-layer code review for anti-patterns and unsafe |
| `review` | Lightweight clippy-based review |
| `project` | Scaffold new Rust project |
| `news` | Daily/weekly Rust news report |
| `features` | Get version changelog and new features |

## Routing

```
subcommand = first_word($ARGUMENTS)
remaining_args = rest($ARGUMENTS)
```

---

## /rust check

Deep code review with 3-layer meta-cognition framework.

**Layers:**
1. **Layer 1:** Ownership, borrow errors, unsafe blocks, clippy warnings
2. **Layer 2:** Design patterns, error handling, abstraction boundaries
3. **Layer 3:** Domain constraint compliance

**Unsafe Audit:** Special attention to `unsafe` blocks, FFI boundaries, raw pointers.

**Output:** Findings with severity ratings (CRITICAL/HIGH/MEDIUM/LOW)

---

## /rust review

Lightweight clippy-based code review.

**Usage:** `/rust review [path]`

Runs `cargo clippy` and categorizes findings.

---

## /rust project

Scaffold new Rust project structure.

**Project Types:**
- Binary — CLI tools, applications, services
- Library — Reusable crates
- Workspace — Multi-crate monorepos
- Web API — Axum or Actix services
- WebAssembly — Browser-based applications

**Initializes:** Cargo.toml, src structure, common dependencies, CI config.

---

## /rust news

Generate Rust news report from multiple sources.

**Usage:** `/rust news [day|week|month] [--category ecosystem|official|foundation]`

**Sources:** This Week in Rust, Rust Blog, Reddit, GitHub trending, crates.io

**Options:**
- `--save [path]` — Save report to file

---

## /rust features

Get Rust version changelog and new features.

**Usage:** `/rust features [version]`

**Examples:**
```bash
/rust features        # Latest stable
/rust features 1.83   # Specific version
```

---

## Usage Examples

```bash
# Deep code review
/rust check src/lib.rs

# Quick clippy review
/rust review

# Scaffold new project
/rust project cli tool for log analysis

# Weekly news digest
/rust news week --category ecosystem

# Check new language features
/rust features 1.84
```
