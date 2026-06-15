---
name: atmos-toolchain
description: "Manages Atmos tool installation, execution, search, and version pinning."
origin: lamella
---

# Atmos Toolchain

Use this skill when managing tool installation and version pinning through Atmos. Keep the main skill focused on `.tool-versions`, registry precedence, and execution flow; use the command reference for the detailed CLI surface.

## When to Use

- Installing or pinning CLI tools for an Atmos repo
- Debugging registry lookup or alias resolution
- Exporting toolchain paths into local shells or CI jobs
- Replacing external version managers with Atmos-native tool management

## Core Rules

1. Treat `.tool-versions` as the project contract for required binaries.
2. Keep aliases stable and registry precedence intentional.
3. Prefer explicit version pins over floating latest behavior.
4. Validate shell or CI environment export after changing install paths.

## Core Workflow

1. Define the install path, version file, aliases, and registries in `atmos.yaml`.
2. Pin required tools in `.tool-versions`.
3. Install or inspect tools through Atmos instead of bypassing the toolchain.
4. Verify `which`, `exec`, and `env` behavior in the target shell or runner.
5. Audit registry sources when a download or resolution path looks surprising.

## Quick Commands

```shell
atmos toolchain install
atmos toolchain which terraform
atmos toolchain env --format=bash
```

```powershell
atmos toolchain install
atmos toolchain which terraform
atmos toolchain env --format=powershell
```

## References

- [references/commands-reference.md](references/commands-reference.md)
