---
name: atmos-components
description: "Designs Atmos components with inheritance, mixins, catalogs, and versioning."
origin: lamella
---

# Atmos Component Architecture

Use this skill when defining reusable component layouts in Atmos. Keep the main skill focused on component identity, inheritance, and instance patterns; use the references for detailed examples.

## When to Use

- Creating a new Terraform, Helmfile, or Packer component
- Designing catalog patterns or reusable abstract defaults
- Mapping one implementation to multiple deployable component instances
- Reviewing inheritance and metadata structure

## Core Rules

1. Separate implementation from stack configuration.
2. Use abstract components for shared defaults that should not be deployed directly.
3. Use `metadata.component` when several Atmos component names point to the same module.
4. Keep inheritance shallow enough to reason about overrides.

## Core Workflow

1. Choose the component type and implementation path.
2. Decide whether the base component is real or abstract.
3. Add inheritance only for reusable defaults or traits.
4. Use multiple component instances only when the state should stay separate.
5. Document versioning and catalog expectations before broad reuse.

## References

- [references/component-types.md](references/component-types.md)
- [references/examples.md](references/examples.md)
