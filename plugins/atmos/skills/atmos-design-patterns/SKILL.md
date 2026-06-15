---
name: atmos-design-patterns
description: "Designs Atmos stack organization, component catalogs, inheritance, configuration composition, version management, and layered configuration."
origin: lamella
---

# Atmos Design Patterns

Use this skill when choosing how an Atmos repo should grow. Keep the main skill focused on organization, inheritance depth, and versioning strategy; use the references for specific layout examples.

## When to Use

- Designing a new stack layout for a multi-environment repo
- Deciding between catalog defaults, mixins, and inline overrides
- Choosing a versioning model for shared components
- Reviewing whether an Atmos repo has become too layered or implicit

## Core Rules

1. Start with the simplest stack layout that fits the environment count.
2. Add hierarchy only when ownership or environment boundaries require it.
3. Keep inheritance shallow enough that operators can explain final state without guesswork.
4. Pick one primary versioning pattern per component family.

## Core Workflow

1. Decide how stacks map to environments, regions, tenants, or layers.
2. Separate reusable defaults from deployable instances.
3. Introduce mixins only when they reduce repetition without hiding behavior.
4. Choose a versioning pattern that matches release cadence and rollback needs.
5. Revisit the layout when imports or overrides become hard to trace mentally.

## References

- [references/stack-organization.md](references/stack-organization.md)
- [references/stack-layouts.md](references/stack-layouts.md)
- [references/stack-hierarchy-and-layers.md](references/stack-hierarchy-and-layers.md)
- [references/version-management.md](references/version-management.md)
- [references/continuous-and-track-versioning.md](references/continuous-and-track-versioning.md)
- [references/explicit-version-pinning.md](references/explicit-version-pinning.md)
