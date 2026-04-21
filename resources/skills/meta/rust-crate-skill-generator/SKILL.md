---
name: rust-crate-skill-generator
description: "Orchestrates on-demand generation of crate-specific skills from docs.rs `llms.txt` data and project dependencies."
metadata:
  argument-hint: "[--force] | <crate_name>"
origin: lamella
---
# Dynamic Skills Manager

Use this skill when syncing Rust dependency knowledge into local crate-specific skills.

## When to Use

- entering a Rust repo with `Cargo.toml`
- checking which dependencies do not yet have local skills
- regenerating crate skills after dependency changes

## Core Workflow

1. parse dependencies from `Cargo.toml` or workspace members
2. compare them with the local generated-skill directory
3. fetch or regenerate missing crate documentation from docs.rs or `llms.txt`
4. update only the crates that changed unless `--force` is requested

## Guardrails

- generated crate skills are local artifacts, not repository content
- support both single-crate and workspace dependency graphs
- prefer regeneration paths that use existing command infrastructure when available
