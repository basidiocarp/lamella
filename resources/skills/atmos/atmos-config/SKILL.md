---
name: atmos-config
description: "Configures atmos.yaml structure, discovery, merging, base paths, settings, imports, and profiles. Use when configuring atmos.yaml, setting up project structure, defining base paths, or troubleshooting configuration merging."
---

# Atmos Project Configuration (atmos.yaml)


## Contents

- [Configuration Discovery](#configuration-discovery)
  - [Environment Variable Override](#environment-variable-override)
- [Minimal Configuration](#minimal-configuration)
- [Complete Section Overview](#complete-section-overview)
  - [Core Structure](#core-structure)
  - [Subsystems](#subsystems)
  - [Platform](#platform)
  - [Settings and Integrations](#settings-and-integrations)
- [Common Configuration Patterns](#common-configuration-patterns)
  - [Multi-Environment Project](#multi-environment-project)
  - [With Authentication and Stores](#with-authentication-and-stores)
  - [With Toolchain and Validation](#with-toolchain-and-validation)
  - [Importing Other Config Files](#importing-other-config-files)
  - [Profiles](#profiles)
- [Terraform Component Settings](#terraform-component-settings)
- [Settings Section](#settings-section)
- [Version Constraints](#version-constraints)
- [Debugging Configuration](#debugging-configuration)
- [Key Principles](#key-principles)


The `atmos.yaml` file is the central project configuration for Atmos. It defines how Atmos discovers stacks, where
components live, how templates are processed, and how every subsystem (auth, stores, workflows, toolchain, validation,
integrations) is configured. Every Atmos project needs at least one `atmos.yaml`.

## Configuration Discovery

Atmos searches for `atmos.yaml` in this order (first found wins):

1. `--config` CLI flag or `ATMOS_CLI_CONFIG_PATH` environment variable.
2. Active profile (`--profile` flag or `ATMOS_PROFILE` environment variable).
3. Current working directory (`./atmos.yaml`).
4. Git repository root (`<repo-root>/atmos.yaml`).
5. Parent directory walk (searches upward until found).
6. Home directory (`~/.atmos/atmos.yaml`).
7. System directory (`/usr/local/etc/atmos/atmos.yaml` on Linux/macOS, `%LOCALAPPDATA%/atmos/atmos.yaml` on Windows).

When multiple files are found, they are **deep-merged** with earlier sources taking precedence.

### Environment Variable Override

Most `atmos.yaml` settings can be overridden via environment variables using the `ATMOS_` prefix:

```shell
ATMOS_BASE_PATH=/path/to/project
ATMOS_STACKS_BASE_PATH=stacks
ATMOS_COMPONENTS_TERRAFORM_BASE_PATH=components/terraform
ATMOS_WORKFLOWS_BASE_PATH=stacks/workflows
ATMOS_LOGS_LEVEL=Debug
```

## Minimal Configuration

The simplest `atmos.yaml` that works:

```yaml
base_path: ""

stacks:
  base_path: "stacks"
  included_paths:
    - "**/*"
  excluded_paths:
    - "**/_defaults.yaml"
    - "catalog/**/*"
  name_template: "{{ .vars.stage }}"

components:
  terraform:
    base_path: "components/terraform"
```

## Complete Section Overview

The `atmos.yaml` file supports these top-level sections. Each section is documented in detail in the
[sections reference](references/sections-reference.md).

### Core Structure

| Section | Purpose | Related Skill |
|---------|---------|---------------|
| `base_path` | Root directory for all relative paths | -- |
| `stacks` | Stack manifest discovery, naming, inheritance | `atmos-stacks` |
| `components` | Component type paths and settings (Terraform, Helmfile, Packer, Ansible) | `atmos-components` |
| `import` | Import other atmos.yaml files for modular configuration | -- |
| `version` | Minimum/maximum Atmos version requirements | -- |

### Subsystems

| Section | Purpose | Related Skill |
|---------|---------|---------------|
| `workflows` | Workflow file discovery path | `atmos-workflows` |
| `commands` | Custom CLI command definitions | `atmos-custom-commands` |
| `aliases` | Command alias mappings | `atmos-custom-commands` |
| `templates` | Go template and Gomplate processing settings | `atmos-templates` |
| `schemas` | Validation schema base paths (JSON Schema, OPA, CUE) | `atmos-schemas` |
| `validate` | Validation behavior (EditorConfig) | `atmos-validation` |

### Platform

| Section | Purpose | Related Skill |
|---------|---------|---------------|
| `auth` | Authentication providers, identities, keyring, integrations | `atmos-auth` |
| `stores` | External key-value store backends | `atmos-stores` |
| `vendor` | Vendoring base path and retry settings | `atmos-vendoring` |
| `toolchain` | CLI tool version management, registries, aliases | `atmos-toolchain` |
| `devcontainer` | Development container configurations | `atmos-devcontainer` |

### Settings and Integrations

| Section | Purpose | Related Skill |
|---------|---------|---------------|
| `settings` | Global CLI behavior: terminal, telemetry, experimental features | -- |
| `integrations` | Atlantis, GitHub Actions, Atmos Pro configuration | `atmos-gitops` |
| `logs` | Log level and log file path | -- |
| `errors` | Error format and Sentry integration | -- |
| `env` | Global environment variables for all operations | -- |
| `profiles` | Named configuration profiles base path | -- |
| `describe` | `describe` command behavior settings | `atmos-introspection` |
| `docs` | Documentation generation settings | -- |
| `metadata` | Project metadata (name, version, tags) | -- |

## Common Configuration Patterns

### Multi-Environment Project

```yaml
base_path: ""

stacks:
  base_path: "stacks"
  included_paths:
// ... (16 lines trimmed)

logs:
  level: Info
```

### With Authentication and Stores

```yaml
base_path: ""

stacks:
  base_path: "stacks"
  included_paths:
// ... (30 lines trimmed)
    options:
      region: us-east-1
      identity: dev-admin
```

### With Toolchain and Validation

```yaml
base_path: ""

stacks:
  base_path: "stacks"
  included_paths:
// ... (22 lines trimmed)
    pager: false
    syntax_highlighting:
      enabled: true
```

### Importing Other Config Files

```yaml
# atmos.yaml
import:
  - atmos.d/stacks.yaml
  - atmos.d/auth.yaml
  - atmos.d/stores.yaml

base_path: ""
components:
  terraform:
    base_path: "components/terraform"
```

Imported files are deep-merged into the main configuration, allowing modular organization of large configs.

### Profiles

```yaml
# profiles/developer/atmos.yaml
auth:
  providers:
    company-sso:
      session:
        duration: 8h
```

```yaml
# profiles/ci/atmos.yaml
auth:
  providers:
    github-oidc:
      kind: github/oidc
      region: us-east-1
```

Activate with `--profile developer` or `ATMOS_PROFILE=ci`.

## Terraform Component Settings

The `components.terraform` section has extensive subsystem configuration:

```yaml
components:
  terraform:
    base_path: "components/terraform"
    command: "terraform"
    apply_auto_approve: false
// ... (16 lines trimmed)
    # Shell configuration for `atmos terraform shell`
    shell:
      shell: "/bin/bash"
```

For the complete Terraform configuration reference, see the `atmos-terraform` skill.

## Settings Section

Global CLI behavior and feature settings:

```yaml
settings:
  # Terminal/UI settings
  terminal:
    pager: false
    max_width: 120
// ... (12 lines trimmed)
  # Experimental features
  experimental:
    enabled: false
```

## Version Constraints

Pin the minimum Atmos version required for the project:

```yaml
version:
  check:
    enabled: true
    constraints: ">= 1.100.0"
```

## Debugging Configuration

```shell
# Show resolved configuration
atmos describe config

# Show where atmos.yaml was loaded from
ATMOS_LOGS_LEVEL=Debug atmos version

# Validate the configuration
atmos validate stacks
```

## Key Principles

1. **Single source of truth**: One `atmos.yaml` (or a set of imported files) configures the entire project.
2. **Convention over configuration**: Sensible defaults minimize required settings.
3. **Deep merging**: Multiple config sources are merged, with CLI flags taking highest precedence.
4. **Environment variable overrides**: Every setting has a corresponding `ATMOS_` environment variable.
5. **Modular composition**: Use `import` to split large configs across files.
6. **Profile switching**: Named profiles swap entire config sections for different contexts.
