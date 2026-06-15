---
name: atmos-terraform
description: "Orchestrates Terraform planning, apply workflows, workspace management, backend configuration, and varfile generation through Atmos."
origin: lamella
---

# Atmos Terraform Orchestration


## Contents

- [Overview](#overview)
- [How Atmos Orchestrates Terraform](#how-atmos-orchestrates-terraform)
- [Core Commands](#core-commands)
- [Multi-Component Operations](#multi-component-operations)
- [Workspace Management](#workspace-management)
- [Interactive Shell](#interactive-shell)
- [Debugging](#debugging)
- [Best Practices](#best-practices)
- [Reference Files](#reference-files)


## Overview

Atmos wraps Terraform CLI for stack-aware infrastructure orchestration. Instead of managing workspaces, backends, variables, and auth manually, Atmos resolves configuration from stack manifests and handles everything automatically.

## How Atmos Orchestrates Terraform

When running any `atmos terraform` command:

1. **Resolves stack configuration** -- Deep-merges all stack manifests
2. **Generates backend.tf.json** -- Derived from stack config
3. **Generates terraform.tfvars.json** -- From `vars` section
4. **Provisions backend** -- If `provision.backend.enabled: true`
5. **Runs terraform init** -- With generated backend config
6. **Selects/creates workspace** -- From context variables
7. **Executes command** -- plan/apply/destroy with varfile

One command does it all: `atmos terraform plan vpc -s plat-ue2-dev`

## Core Commands

| Command | Purpose | Key Flags |
|---------|---------|-----------|
| `plan` | Generate execution plan | `--skip-planfile`, `-target` |
| `apply` | Apply changes | `--from-plan`, `--planfile`, `-auto-approve` |
| `deploy` | Plan + auto-approve apply (CI/CD) | `--from-plan`, `--deploy-run-init` |
| `destroy` | Destroy resources | `-auto-approve`, `-target` |
| `init` | Initialize (usually automatic) | `-reconfigure`, `-upgrade` |

```shell
# Basic workflow
atmos terraform plan vpc -s plat-ue2-dev
atmos terraform apply vpc -s plat-ue2-dev --from-plan

# CI/CD deployment
atmos terraform deploy vpc -s plat-ue2-dev
```

See [references/commands-reference.md](references/commands-reference.md) for all commands.

## Multi-Component Operations

```shell
atmos terraform plan --all                    # All components
atmos terraform plan --stack prod            # All in stack
atmos terraform deploy --affected            # Git-changed only
atmos terraform deploy --affected --include-dependents
atmos terraform plan --query '.vars.tags.team == "eks"'
atmos terraform deploy --all --dry-run       # Preview first!
```

## Workspace Management

Atmos auto-calculates workspace names from context (namespace, tenant, environment, stage).

**Stable workspace key:**
```yaml
components:
  terraform:
    vpc/defaults:
      metadata:
        name: vpc              # Stable identity
        component: vpc/v2      # Implementation
```

**Configuration:**
```yaml
# atmos.yaml
components:
  terraform:
    init_run_reconfigure: true
    workspaces_enabled: true
```

## Interactive Shell

Drop into pre-configured shell for a component:

```shell
atmos terraform shell vpc -s plat-ue2-dev
```

- Working directory set to component folder
- `terraform.tfvars.json` and `backend.tf.json` generated
- Workspace selected, ENV vars set
- Run native terraform commands directly

## Debugging

```shell
# See fully resolved config
atmos describe component vpc -s plat-ue2-dev

# Preview without executing
atmos terraform plan vpc -s dev --dry-run

# Terraform debug logging
export TF_LOG=DEBUG
atmos terraform plan vpc -s dev
```

## Best Practices

1. **Two-stage for production:** `plan` → review → `apply --from-plan`
2. **Use `deploy` for CI/CD:** Auto-approve for automated pipelines
3. **Preview multi-component:** Always `--dry-run` before `--all`/`--affected`
4. **Let Atmos manage backends:** Set `auto_generate_backend_file: true`
5. **Debug with `describe component`:** Shows fully merged config
6. **Add to .gitignore:** `backend.tf.json`, `terraform.tfvars.json`
7. **Use shell for debugging:** Full context, native terraform commands
8. **Enable backend provisioning:** Solves bootstrap problem

## Reference Files

- [references/commands-reference.md](references/commands-reference.md) - All terraform subcommands, flags, examples
- [references/backend-configuration.md](references/backend-configuration.md) - Backend types (S3, GCS, Azure), auth, provisioning
