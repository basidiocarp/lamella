---
name: atmos-yaml-functions
description: "Uses Atmos YAML functions for dynamic configuration values."
origin: lamella
---

# Atmos YAML Functions

Use this skill when adding dynamic values to Atmos configuration. Keep the main skill focused on when to use YAML functions instead of raw templates or shell glue; use the references for the function-by-function surface.

## When to Use

- Pulling values from Terraform state or external stores
- Reading environment variables or repository paths into stack config
- Including files or evaluating structured templates inside YAML
- Debugging function precedence, evaluation timing, or data-shape issues

## Core Rules

1. Prefer YAML functions over ad hoc shell execution where a native function exists.
2. Prefer `!terraform.state` over `!terraform.output` when the backend supports it.
3. Keep function calls readable and avoid building opaque chains.
4. Use `!template` only when you need structured output, not for every string interpolation.

## Core Workflow

1. Choose the function based on data source and expected return type.
2. Confirm where the function is evaluated and what context it can access.
3. Keep defaults, fallbacks, and query expressions explicit.
4. Validate resolved output before layering more functions on top.
5. Move repeated logic into shared config or helper references instead of copy-pasting complex tags.

## References

- [references/yaml-functions.md](references/yaml-functions.md)
- [references/terraform-and-store-functions.md](references/terraform-and-store-functions.md)
- [references/runtime-and-file-functions.md](references/runtime-and-file-functions.md)
- [references/template-and-utility-functions.md](references/template-and-utility-functions.md)
