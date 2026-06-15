---
name: atmos-stacks
description: "Configures Atmos stacks with imports, inheritance, deep merging, locals, vars, settings, metadata, and overrides."
origin: lamella
---

# Atmos Stack Configuration

Use this skill when designing or debugging stack manifests. Keep the main skill focused on stack discovery, merge behavior, and component-level configuration flow; use the references for import and inheritance specifics.

## When to Use

- Creating or restructuring stack manifests
- Debugging how imports or inheritance produce final component state
- Deciding where `vars`, `locals`, `settings`, or `overrides` should live
- Reviewing `_defaults.yaml` conventions and stack naming behavior

## Core Rules

1. Separate shared defaults from deployable stack manifests.
2. Keep import chains understandable without reading half the repository.
3. Use `locals` for file-local composition, not cross-file state.
4. Treat deep-merge behavior as part of the contract and test it explicitly.

## Core Workflow

1. Confirm stack discovery and naming behavior from `atmos.yaml`.
2. Define the import chain from general defaults to specific deployment state.
3. Place component inputs in the narrowest scope that still keeps reuse clear.
4. Inspect resolved stack output before assuming a merge bug.
5. Simplify inheritance once the override story stops being obvious.

## References

- [references/import-patterns.md](references/import-patterns.md)
- [references/inheritance-deep-merge.md](references/inheritance-deep-merge.md)
