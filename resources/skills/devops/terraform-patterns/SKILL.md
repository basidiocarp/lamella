---
name: terraform-patterns
description: "Implements infrastructure as code with Terraform across AWS, Azure, or GCP."
origin: lamella
---

# Terraform Patterns

## Contents

- [When to Use](#when-to-use)
- [Core Workflow](#core-workflow)
- [Reference Guide](#reference-guide)
- [Constraints](#constraints)
- [Output Templates](#output-templates)

## When to Use

- Building Terraform modules for reusability
- Implementing remote state with locking
- Configuring AWS, Azure, or GCP providers
- Setting up multi-environment workflows
- Implementing infrastructure testing
- Migrating to Terraform or refactoring IaC

## Core Workflow

1. **Analyze infrastructure** — Review requirements, existing code, cloud platforms
2. **Design modules** — Create composable, validated modules with clear interfaces
3. **Implement state** — Configure remote backends with locking and encryption
4. **Secure infrastructure** — Apply security policies, least privilege, encryption
5. **Test and validate** — Run terraform plan, policy checks, automated tests

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Modules | `references/module-patterns.md` | Creating modules, inputs/outputs, versioning |
| State | `references/state-backends-and-workspaces.md` | Remote backends, locking, workspaces, backend config |
| State Ops | `references/state-operations-and-security.md` | Imports, migrations, force unlock, state security |
| Providers | `references/providers.md` | AWS/Azure/GCP configuration, authentication |
| Testing | `references/terraform-test-and-terratest.md` | terraform plan, terraform test, Terratest |
| Policy Checks | `references/policy-and-lint-checks.md` | OPA, Conftest, TFLint |
| Best Practices | `references/best-practices.md` | DRY patterns, naming, security, cost tracking |

## Constraints

### MUST DO
- Use semantic versioning for modules
- Enable remote state with locking
- Validate inputs with validation blocks
- Use consistent naming conventions
- Tag all resources for cost tracking
- Document module interfaces
- Pin provider versions
- Run terraform fmt and validate

### MUST NOT DO
- Store secrets in plain text
- Use local state for production
- Skip state locking
- Hardcode environment-specific values
- Mix provider versions without constraints
- Create circular module dependencies
- Skip input validation
- Commit .terraform directories

## Output Templates

When implementing Terraform solutions, provide:
1. Module structure (main.tf, variables.tf, outputs.tf)
2. Backend configuration for state
3. Provider configuration with versions
4. Example usage with tfvars
5. Brief explanation of design decisions
