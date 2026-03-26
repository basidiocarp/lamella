---
name: atmos-toolchain
description: "Manages the Atmos toolchain with install, exec, search, and environment commands, including Aqua-based version pinning. Use when managing the Atmos toolchain, installing tools via Aqua, pinning versions, or executing commands across tools."
---

# Atmos Toolchain


## Contents

- [Purpose](#purpose)
- [Core Concepts](#core-concepts)
  - [.tool-versions File](#tool-versions-file)
  - [Tool Installation Path](#tool-installation-path)
  - [Registries](#registries)
  - [Aliases](#aliases)
- [Configuration in atmos.yaml](#configuration-in-atmosyaml)
- [Key Commands](#key-commands)
  - [Installation](#installation)
  - [Version Management](#version-management)
  - [Discovery](#discovery)
  - [Execution](#execution)
  - [Registry Management](#registry-management)
- [Environment Variables](#environment-variables)
- [Precedence Order](#precedence-order)
- [Shell Integration](#shell-integration)
- [Template Variables in Registries](#template-variables-in-registries)
- [Common Patterns](#common-patterns)
  - [Project Setup](#project-setup)
  - [CI/CD Integration](#cicd-integration)
  - [Custom Tool Registry](#custom-tool-registry)
- [Unsupported Aqua Features](#unsupported-aqua-features)


## Purpose

The Atmos toolchain manages CLI tool installation and versioning natively, using the Aqua package registry
ecosystem. It replaces external version managers (asdf, mise, aqua CLI) with a built-in system that
integrates directly with atmos.yaml configuration.

## Core Concepts

### .tool-versions File

The `.tool-versions` file (asdf-compatible format) declares which tools and versions a project needs:

```text
terraform 1.9.8
opentofu 1.10.3
kubectl 1.28.0
helm 3.13.0
jq 1.7.1
```

- One tool per line, format: `toolname version [version2 version3...]`
- Multiple versions per tool are supported; first version is the default
- File location: project root (default), overridable via `toolchain.file_path` in atmos.yaml

### Tool Installation Path

Tools are installed to `.tools/` (default) in a structured layout:

```text
.tools/bin/{os}/{tool}/{version}/{binary}
```

Override via `toolchain.install_path` in atmos.yaml or `ATMOS_TOOLCHAIN_PATH` env var.

### Registries

Atmos supports three registry types for discovering and downloading tools:

**Aqua Registry** -- The primary source, providing 1,000+ tools:
```yaml
registries:
  - name: aqua
    type: aqua
    source: https://github.com/aquaproj/aqua-registry/tree/main/pkgs
    priority: 10
```

**Inline (Atmos) Registry** -- Define tools directly in atmos.yaml:
```yaml
registries:
  - name: custom
    type: atmos
    priority: 150
    tools:
      owner/repo:
        type: github_release
        url: "asset_{{.Version}}_{{.OS}}_{{.Arch}}"
        format: tar.gz
```

**File-Based Registry** -- Local or remote Aqua-format files:
```yaml
registries:
  - name: corporate
    type: aqua
    source: file://./custom-registry.yaml
    priority: 100
```

**Priority System:** Higher numbers are checked first. First match wins.
Typical ordering: inline (150) > corporate (100) > public aqua (10).

### Aliases

Map short names to fully qualified tool identifiers:

```yaml
toolchain:
  aliases:
    terraform: hashicorp/terraform
    tf: hashicorp/terraform
    kubectl: kubernetes-sigs/kubectl
```

## Configuration in atmos.yaml

```yaml
toolchain:
  install_path: .tools              # Where to install tools
  file_path: .tool-versions         # Path to version file

  aliases:
// ... (15 lines trimmed)
      type: aqua
      source: https://github.com/aquaproj/aqua-registry/tree/main/pkgs
      priority: 10
```

## Key Commands

### Installation

```bash
atmos toolchain install                    # Install all tools from .tool-versions
atmos toolchain install terraform@1.9.8    # Install specific tool and version
atmos toolchain uninstall terraform@1.9.8  # Remove installed tool
atmos toolchain clean                      # Remove all installed tools and cache
```

### Version Management

```bash
atmos toolchain add terraform              # Add tool to .tool-versions (latest)
atmos toolchain add terraform@1.9.8        # Add with specific version
atmos toolchain remove terraform           # Remove from .tool-versions
atmos toolchain set terraform 1.9.8        # Set default version
atmos toolchain get terraform              # Get version from .tool-versions
```

### Discovery

```bash
atmos toolchain search terraform           # Search across registries
atmos toolchain info hashicorp/terraform   # Display tool configuration
atmos toolchain list                       # Show installed tools
atmos toolchain which terraform            # Show full path to binary
atmos toolchain du                         # Show disk usage
```

### Execution

```bash
atmos toolchain exec terraform@1.9.8 -- plan    # Run specific version
atmos toolchain env --format=bash                # Export PATH for shell
atmos toolchain path                             # Print PATH entries
```

### Registry Management

```bash
atmos toolchain registry list              # List all registries
atmos toolchain registry list aqua         # List tools in specific registry
atmos toolchain registry search jq         # Search across registries
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ATMOS_GITHUB_TOKEN` / `GITHUB_TOKEN` | GitHub token for higher API rate limits |
| `ATMOS_TOOL_VERSIONS` | Override .tool-versions file path |
| `ATMOS_TOOLCHAIN_PATH` | Override tool installation directory |
| `ATMOS_TOOLCHAIN_ENV_FORMAT` | Default format for `env` command |

## Precedence Order

1. CLI flags (highest)
2. Environment variables
3. atmos.yaml configuration
4. Defaults (lowest)

## Shell Integration

Use the format that matches your shell for automatic PATH setup.

```bash
eval "$(atmos toolchain env --format=bash)"
```

Add that command to `~/.bashrc` or `~/.zshrc` for Bash and Zsh shells.

```powershell
Invoke-Expression (& atmos toolchain env --format=powershell)
```

Add that command to your PowerShell profile for automatic PATH setup on Windows.

Other shell formats: `--format=fish`, `--format=github` (for CI).

## Template Variables in Registries

Aqua and inline registries support Go templates in asset URLs:

| Variable | Description |
|----------|-------------|
| `{{.Version}}` | Full version string |
| `{{trimV .Version}}` | Version without 'v' prefix |
| `{{.OS}}` | Operating system (linux, darwin, windows) |
| `{{.Arch}}` | Architecture (amd64, arm64) |

## Common Patterns

### Project Setup

```yaml
# atmos.yaml
toolchain:
  aliases:
    terraform: hashicorp/terraform
    kubectl: kubernetes-sigs/kubectl
  registries:
    - name: aqua
      type: aqua
      source: https://github.com/aquaproj/aqua-registry/tree/main/pkgs
      priority: 10
```

```text
# .tool-versions
hashicorp/terraform 1.9.8
kubernetes-sigs/kubectl 1.28.0
helmfile/helmfile 0.168.0
```

```bash
# Install everything
atmos toolchain install

# Verify
atmos toolchain list
```

### CI/CD Integration

```yaml
# GitHub Actions
- name: Install tools
  run: |
    atmos toolchain install
    eval "$(atmos toolchain env --format=github)"
```

### Custom Tool Registry

```yaml
toolchain:
  registries:
    - name: internal
      type: atmos
      priority: 150
      tools:
        company/internal-tool:
          type: github_release
          url: "internal-tool_{{.Version}}_{{.OS}}_{{.Arch}}.tar.gz"
          format: tar.gz
    - name: aqua
      type: aqua
      source: https://github.com/aquaproj/aqua-registry/tree/main/pkgs
      priority: 10
```

## Unsupported Aqua Features

These Aqua features are intentionally not supported to keep Atmos focused:

- `github_content`, `github_archive`, `go_build`, `cargo` package types
- `version_filter`, `version_expr` version manipulation
- `import` (use multiple registries instead)
- `command_aliases` (use `toolchain.aliases` in atmos.yaml)
- `cosign`, `minisign`, `slsa_provenance` signature verification
