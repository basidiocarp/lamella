---
name: atmos-devcontainer
description: "Manages Atmos devcontainer lifecycle operations, instance configuration, and VS Code integration. Use when managing Atmos devcontainers, starting or stopping instances, or integrating with VS Code development environments."
---

# Atmos Devcontainer


## Contents

- [Purpose](#purpose)
- [Core Concepts](#core-concepts)
  - [Devcontainer Configuration](#devcontainer-configuration)
  - [Supported Spec Features](#supported-spec-features)
  - [Importing from devcontainer.json](#importing-from-devcontainerjson)
  - [Container Naming](#container-naming)
  - [Container Labels](#container-labels)
  - [Runtime Auto-Detection](#runtime-auto-detection)
- [Key Commands](#key-commands)
  - [Lifecycle Management](#lifecycle-management)
  - [Interactive Access](#interactive-access)
  - [Command Execution](#command-execution)
  - [Information](#information)
- [Instance Management](#instance-management)
- [Authentication Integration](#authentication-integration)
- [Common Patterns](#common-patterns)
  - [Standard Development Environment](#standard-development-environment)
  - [Multiple Environments](#multiple-environments)
  - [Custom Dockerfile](#custom-dockerfile)


## Purpose

Atmos provides native devcontainer management for creating standardized, reproducible development
environments. It provides built-in orchestration that integrates with Atmos authentication,
toolchains, and project configuration, replacing the need for external orchestration tooling
like Geodesic (though Geodesic container images remain fully supported).

**Note:** The devcontainer feature is currently **experimental**. By default (`settings.experimental: warn`),
Atmos displays a warning but runs the command. Set `settings.experimental: silence` in `atmos.yaml` to
suppress the warning, or `disable` to block experimental commands entirely.

## Core Concepts

### Devcontainer Configuration

Devcontainers are configured at the **top level** of `atmos.yaml` (not under `components:`).
Each named devcontainer defines container settings and a devcontainer spec:

```yaml
devcontainer:
  default:
    settings:
      runtime: docker           # docker or podman (auto-detected if omitted)
    spec:
// ... (8 lines trimmed)
      containerEnv:
        ATMOS_BASE_PATH: "/workspace"
      remoteUser: "root"
```

### Supported Spec Features

The following devcontainer spec fields are supported:

| Field | Description |
|-------|-------------|
| `name` | Display name for the container |
| `image` | Container image to use |
| `build.dockerfile` | Path to Dockerfile |
| `build.context` | Build context directory |
| `build.args` | Build arguments |
| `workspaceFolder` | Path inside container for workspace |
| `workspaceMount` | Mount specification for workspace |
| `mounts` | Additional mount points |
| `forwardPorts` | Ports to forward to host |
| `portsAttributes` | Port binding configuration |
| `runArgs` | Extra arguments passed to container runtime |
| `containerEnv` | Environment variables set inside container |
| `remoteUser` | User to run as inside container |

Unsupported fields (`features`, `postCreateCommand`, `customizations`, etc.) are silently ignored
with debug-level logging, allowing compatibility with VS Code `devcontainer.json` files.
Use `ATMOS_LOGS_LEVEL=Debug` to see which fields are being ignored.

### Importing from devcontainer.json

Use `!include` to import existing VS Code devcontainer configurations:

```yaml
devcontainer:
  vscode:
    settings:
      runtime: docker
    spec: !include .devcontainer/devcontainer.json
```

### Container Naming

Containers follow the naming convention: `atmos-devcontainer.{name}.{instance}`

- Dot (`.`) separator avoids parsing ambiguity with hyphenated names
- Default instance name is `default`
- Multiple instances of the same devcontainer can run simultaneously

### Container Labels

All Atmos devcontainers are labeled for management:

```text
com.atmos.type=devcontainer
com.atmos.devcontainer.name={name}
com.atmos.devcontainer.instance={instance}
com.atmos.workspace={workspace-path}
com.atmos.created={timestamp}
```

### Runtime Auto-Detection

Atmos automatically detects the available container runtime:
1. Docker (checked first)
2. Podman (fallback)

Override with `settings.runtime` in the devcontainer configuration.

## Key Commands

### Lifecycle Management

These commands are shell-neutral and work the same in Bash, Zsh, and PowerShell.

```text
atmos devcontainer start default           # Start (create if needed)
atmos devcontainer stop default            # Stop running container
atmos devcontainer remove default          # Remove container and data
atmos devcontainer rebuild default         # Destroy and recreate from scratch
```

### Interactive Access

```text
atmos devcontainer shell                   # Start + attach in one command
atmos devcontainer shell default           # Named devcontainer
atmos devcontainer attach default          # Attach to running container
```

### Command Execution

```bash
atmos devcontainer exec default -- terraform plan
atmos devcontainer exec default -- aws sts get-caller-identity
```

### Information

```bash
atmos devcontainer list                    # List all configured devcontainers
atmos devcontainer config default          # Display resolved configuration
atmos devcontainer logs default            # Show container logs
```

## Instance Management

Multiple instances of the same devcontainer can run simultaneously:

```bash
atmos devcontainer start default --instance alice
atmos devcontainer start default --instance bob
atmos devcontainer list                    # Shows both instances
atmos devcontainer attach default --instance alice
```

## Authentication Integration

Devcontainers integrate with the Atmos identity system for credential injection:

```bash
atmos devcontainer shell default --identity prod-admin
atmos devcontainer exec default --identity dev -- terraform plan
```

When `--identity` is specified, Atmos resolves the identity credentials and passes them
to the container environment.

## Common Patterns

### Standard Development Environment

```yaml
devcontainer:
  default:
    spec:
      name: "Infrastructure Dev"
      image: "cloudposse/geodesic:latest"
      workspaceFolder: "/workspace"
      workspaceMount: "type=bind,source=${WORKSPACE},target=/workspace"
      mounts:
        - "type=bind,source=${HOME}/.aws,target=/root/.aws,readonly"
        - "type=bind,source=${HOME}/.ssh,target=/root/.ssh,readonly"
      containerEnv:
        ATMOS_BASE_PATH: "/workspace"
        AWS_PROFILE: "default"
      remoteUser: "root"
```

### Multiple Environments

```yaml
devcontainer:
  dev:
    spec:
      name: "Dev Environment"
      image: "cloudposse/geodesic:latest"
// ... (8 lines trimmed)
      containerEnv:
        ATMOS_BASE_PATH: "/workspace"
        ENVIRONMENT: "prod"
```

### Custom Dockerfile

```yaml
devcontainer:
  custom:
    spec:
      name: "Custom Dev"
      build:
        dockerfile: .devcontainer/Dockerfile
        context: .
        args:
          TERRAFORM_VERSION: "1.9.8"
      workspaceFolder: "/workspace"
      workspaceMount: "type=bind,source=${WORKSPACE},target=/workspace"
```
