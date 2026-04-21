---
name: atmos-devcontainer
description: "Manages Atmos devcontainer lifecycle operations, instance configuration, and VS Code integration."
origin: lamella
---

# Atmos Devcontainer

Use this skill when managing Atmos-backed devcontainers. Keep the main skill focused on lifecycle, instance naming, and runtime expectations; use the command reference for the full CLI surface.

## When to Use

- Starting, stopping, rebuilding, or attaching to an Atmos devcontainer
- Importing an existing `devcontainer.json` into `atmos.yaml`
- Choosing between Docker and Podman runtimes
- Reviewing identity-aware local development flows

## Core Rules

1. Treat the feature as experimental until the repo has validated its workflow.
2. Keep container spec and project-specific credentials separate.
3. Use named instances only when parallel environments are genuinely needed.
4. Prefer reproducible mounts and explicit runtime settings over host assumptions.

## Core Workflow

1. Define the devcontainer spec in `atmos.yaml`.
2. Confirm runtime, workspace mount, and image or build source.
3. Start one default instance and verify attach, exec, and logs flows.
4. Add identity-aware execution only after the baseline container behaves correctly.
5. Split specialized environments into separate named devcontainers rather than one overloaded spec.

## Quick Commands

```shell
atmos devcontainer start default
atmos devcontainer shell default
atmos devcontainer exec default -- terraform plan
```

```powershell
atmos devcontainer start default
atmos devcontainer shell default
atmos devcontainer exec default -- terraform plan
```

## References

- [references/commands-reference.md](references/commands-reference.md)
