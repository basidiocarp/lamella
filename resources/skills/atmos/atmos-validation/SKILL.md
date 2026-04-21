---
name: atmos-validation
description: "Validates Atmos configs with Rego, JSON Schema, and manifests."
origin: lamella
---

# Atmos Validation Framework

Use this skill to enforce structure and policy before Atmos provisions infrastructure. Keep this file focused on validation modes and execution order; detailed policy shapes live in the references.

## When to Use

- Adding JSON Schema validation for components or manifests
- Writing or debugging OPA and Rego policies
- Running `atmos validate component` or `atmos validate stacks`
- Hardening CI before `plan` or `apply`

## Validation Modes

| Mode | Best For |
|------|----------|
| JSON Schema | structural checks and required fields |
| OPA / Rego | business rules and policy logic |
| Manifest schema | validating Atmos stack documents themselves |

## Core Workflow

1. Decide whether the rule is structural or policy-based.
2. Put schema base paths in `atmos.yaml`.
3. Attach validation steps in component settings.
4. Run `atmos validate component` on the target stack.
5. Run `atmos validate stacks` when checking the broader configuration set.

## References

- [references/json-schema.md](references/json-schema.md)
- [references/opa-policies.md](references/opa-policies.md)
- [references/schema-structure.md](references/schema-structure.md)
- [references/schema-top-level.md](references/schema-top-level.md)
- [references/schema-definitions.md](references/schema-definitions.md)
- [references/schema-specialized-sections.md](references/schema-specialized-sections.md)
- [references/schema-system.md](references/schema-system.md)
- [references/schema-updates.md](references/schema-updates.md)
