---
name: atmos-config
description: "Configures atmos.yaml structure, discovery, merging, base paths, settings, imports, and profiles."
origin: lamella
---

# Atmos Project Configuration

Use this skill as the entrypoint for `atmos.yaml`. It is the router for discovery rules, section layout, paths, and subsystem wiring across the Atmos skill set.

## When to Use

- Creating or restructuring `atmos.yaml`
- Troubleshooting discovery, deep-merge, or profile behavior
- Mapping stack paths, component paths, schemas, commands, or templates
- Deciding which Atmos subsystem owns a setting

## Core Model

| Area | What it controls |
|------|------------------|
| Discovery | where Atmos finds config and which source wins |
| Paths and stacks | base paths, stack discovery, naming, schemas |
| Components and commands | Terraform, Helmfile, Packer, workflows, commands |
| Platform services | auth, stores, toolchain, integrations |

## Core Workflow

1. Define repository root and stack discovery first.
2. Add component base paths and only then layer in workflows, commands, and templates.
3. Keep auth, stores, validation, and toolchain settings in their own focused sections.
4. Use imports or profiles only when they reduce duplication instead of hiding ownership.
5. Validate path resolution and merged output before debugging downstream commands.

## References

- [references/sections-reference.md](references/sections-reference.md)
- [references/paths-stacks-and-schemas.md](references/paths-stacks-and-schemas.md)
- [references/components-commands-and-templates.md](references/components-commands-and-templates.md)
- [references/auth-stores-and-toolchain.md](references/auth-stores-and-toolchain.md)
