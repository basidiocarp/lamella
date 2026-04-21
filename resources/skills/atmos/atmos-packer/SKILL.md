---
name: atmos-packer
description: "Orchestrates Packer initialization, builds, validation, inspection, outputs, and image source management through Atmos."
origin: lamella
---

# Atmos Packer Orchestration

Use this skill when running Packer builds through Atmos. Keep the main skill focused on stack-driven variable resolution, template targeting, and source provisioning; use the references for command details and output handling.

## When to Use

- Running `init`, `build`, `validate`, `inspect`, or `output` through Atmos
- Selecting between directory mode and explicit template files
- Managing per-environment image sources or vendored Packer components
- Reviewing manifest output extraction and build debugging

## Core Workflow

1. Resolve the stack and component first.
2. Confirm which template file or directory should drive the build.
3. Check generated variables before debugging the image definition itself.
4. Validate before build when introducing new templates or source changes.
5. Treat source auto-provisioning and output queries as part of the build contract.

## Quick Commands

```shell
atmos packer init aws/bastion -s nonprod
atmos packer validate aws/bastion -s nonprod
atmos packer build aws/bastion -s nonprod
```

```powershell
atmos packer init aws/bastion -s nonprod
atmos packer validate aws/bastion -s nonprod
atmos packer build aws/bastion -s nonprod
```

## References

- [references/commands-reference.md](references/commands-reference.md)
- [references/init-build-and-validate.md](references/init-build-and-validate.md)
- [references/inspect-output-version-and-source.md](references/inspect-output-version-and-source.md)
