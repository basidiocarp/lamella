---
name: atmos-validation
description: "Policy validation: OPA/Rego policies, JSON Schema, schema manifests, IDE auto-completion, SchemaStore integration. Use when validating Atmos configuration with OPA/Rego policies, enforcing JSON Schema compliance, configuring IDE auto-completion for stack manifests, or debugging validation failures."
metadata:
  version: "1.0.0"
---

# Atmos Validation Framework


## Contents

- [Overview](#overview)
- [Validation Commands](#validation-commands)
  - [`atmos validate component`](#atmos-validate-component)
  - [`atmos validate stacks`](#atmos-validate-stacks)
- [Configuring Validation](#configuring-validation)
  - [Schema Base Paths in `atmos.yaml`](#schema-base-paths-in-atmosyaml)
  - [Component Validation Settings](#component-validation-settings)
  - [Validation Step Properties](#validation-step-properties)
- [JSON Schema Validation](#json-schema-validation)
  - [Writing JSON Schema for Components](#writing-json-schema-for-components)
  - [Input Structure for JSON Schema](#input-structure-for-json-schema)
- [OPA/Rego Policy Validation](#oparego-policy-validation)
  - [Writing OPA Policies for Atmos](#writing-opa-policies-for-atmos)
  - [OPA Input Structure](#opa-input-structure)
  - [Policy Execution Context](#policy-execution-context)
  - [Modular OPA Policies](#modular-opa-policies)
- [Atmos Manifest JSON Schema Validation](#atmos-manifest-json-schema-validation)
- [EditorConfig Validation](#editorconfig-validation)
- [Validation in CI/CD Pipelines](#validation-in-cicd-pipelines)
  - [Running Validation in GitHub Actions](#running-validation-in-github-actions)
  - [Pre-Provisioning Validation](#pre-provisioning-validation)
- [Best Practices for Validation Policies](#best-practices-for-validation-policies)
- [Common Validation Patterns](#common-validation-patterns)
  - [Required Tags](#required-tags)
  - [Resource Limits by Environment](#resource-limits-by-environment)
  - [Naming Convention Enforcement](#naming-convention-enforcement)
  - [Blocking Dangerous Operations](#blocking-dangerous-operations)
  - [Network Security Rules](#network-security-rules)
- [Rego Syntax Notes](#rego-syntax-notes)
- [Additional Resources](#additional-resources)


## Overview

Atmos provides a built-in validation framework that enforces policies and schema constraints on stack
configurations before infrastructure is provisioned. Validation ensures clean, correct, and compliant
configurations across teams and environments. Atmos supports three types of native validation:

1. **JSON Schema** -- Validates the structure and types of component configurations
2. **Open Policy Agent (OPA)** -- Enforces custom business rules using Rego policies
3. **EditorConfig Checker** -- Ensures consistent coding styles across files

Validation runs automatically before `atmos terraform plan` and `atmos terraform apply`, preventing
misconfigured infrastructure from being provisioned. It can also run on-demand using the
`atmos validate component` and `atmos validate stacks` commands.

## Validation Commands

### `atmos validate component`

Validates a specific component in a stack against configured validation rules:

```shell
# Validate using rules defined in settings.validation
atmos validate component vpc -s plat-ue2-prod

# Validate with explicit schema path and type
atmos validate component vpc -s plat-ue2-prod \
// ... (8 lines trimmed)

# Validate with a timeout
atmos validate component vpc -s plat-ue2-dev --timeout 15
```

If `--schema-path` and `--schema-type` are not provided on the command line, Atmos uses the
`settings.validation` section from the component's stack configuration.

### `atmos validate stacks`

Validates all stack configurations and YAML syntax:

```shell
atmos validate stacks
```

This command checks:
- All YAML manifest files for syntax errors and inconsistencies
- All imports for correct configuration, valid data types, and valid file references
- Schema validation of all manifest sections using the Atmos Manifest JSON Schema
- Detection of misconfigured or duplicated components in stacks

If the same component is defined in multiple stack manifest files for the same stack with
different configurations, Atmos reports it as an error.

## Configuring Validation

### Schema Base Paths in `atmos.yaml`

Configure the base paths for validation schemas in `atmos.yaml`:

```yaml
# atmos.yaml
schemas:
  # JSON Schema validation
  jsonschema:
    # Supports absolute and relative paths
// ... (11 lines trimmed)
    # JSON Schema for validating Atmos manifests themselves
    # Can be set via ATMOS_SCHEMAS_ATMOS_MANIFEST env var
    manifest: "stacks/schemas/atmos/atmos-manifest/1.0/atmos-manifest.json"
```

### Component Validation Settings

Define validation rules in the `settings.validation` section of component configurations:

```yaml
components:
  terraform:
    vpc:
      settings:
        validation:
// ... (12 lines trimmed)
            description: Check 'vpc' component configuration using OPA policy
            disabled: false
            timeout: 10
```

### Validation Step Properties

Each validation step supports these properties:

| Property | Type | Description |
|----------|------|-------------|
| `schema_type` | string | `jsonschema` or `opa` |
| `schema_path` | string | Path to the schema file (absolute or relative to base_path) |
| `module_paths` | list | (OPA only) Additional Rego module paths for imports |
| `description` | string | Human-readable description of the validation step |
| `disabled` | boolean | Set to `true` to skip this step (default: `false`) |
| `timeout` | integer | Timeout in seconds for the validation step |

All validation steps must pass for the component to be provisioned. If any step fails, Atmos
blocks the operation with the validation error messages.

## JSON Schema Validation

JSON Schema validates the structure, types, and required fields of component configurations.
Atmos supports the JSON Schema 2020-12 specification.

### Writing JSON Schema for Components

Place schema files in the `schemas.jsonschema.base_path` directory:

```json
{
  "$id": "vpc-component",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "vpc component validation",
  "description": "JSON Schema for the 'vpc' Atmos component.",
// ... (22 lines trimmed)
    }
  }
}
```

### Input Structure for JSON Schema

The entire component configuration is passed as the JSON document. The schema validates against
the full configuration including `vars`, `settings`, `env`, `backend`, and other sections.

## OPA/Rego Policy Validation

The Open Policy Agent (OPA) provides policy-as-code validation using the Rego language. OPA
policies enable complex business rule validation that goes beyond structural schema checks.

### Writing OPA Policies for Atmos

All Atmos OPA policies must:
1. Use `package atmos`
2. Define `errors` rules that return a set of error message strings (sets are serialized as arrays in OPA query results)

```rego
package atmos

import future.keywords.in

# Block public IPs in production
// ... (8 lines trimmed)
    not re_match("^[a-zA-Z0-9]{2,20}$", input.vars.name)
    message = "Component name must be 2-20 alphanumeric characters"
}
```

### OPA Input Structure

The `input` object contains the full component configuration as returned by
`atmos describe component`. Key fields include:

- `input.vars` -- Component variables
- `input.settings` -- Component settings
- `input.env` -- Environment variables
- `input.backend` -- Backend configuration
- `input.metadata` -- Component metadata
- `input.workspace` -- Terraform workspace name

### Policy Execution Context

When Atmos executes commands like `terraform plan` or `terraform apply`, additional context
is provided to OPA policies:

- `input.process_env` -- Map of environment variables in the current process
- `input.cli_args` -- List of CLI arguments (e.g., `["terraform", "apply"]`)
- `input.tf_cli_vars` -- Map of variables from command-line `-var` arguments
- `input.env_tf_cli_args` -- List of arguments from `TF_CLI_ARGS` env var
- `input.env_tf_cli_vars` -- Map of variables from `TF_CLI_ARGS` env var

Context-aware policies can use these inputs:

```rego
package atmos

# Don't allow terraform apply if foo is set to "foo"
errors[message] {
    count(input.cli_args) >= 2
    input.cli_args[0] == "terraform"
    input.cli_args[1] == "apply"
    input.vars.foo == "foo"
    message = "Cannot apply when 'foo' variable is set to 'foo'"
}
```

### Modular OPA Policies

Atmos supports splitting OPA policies across multiple Rego files. Define reusable constants
and helper functions in separate files:

```rego
# stacks/schemas/opa/catalog/constants/constants.rego
package atmos.constants

vpc_dev_max_azs_error := "In 'dev', only 2 Availability Zones are allowed"
vpc_name_regex := "^[a-zA-Z0-9]{2,20}$"
```

Import them in your main policy:

```rego
package atmos

import data.atmos.constants.vpc_dev_max_azs_error
import data.atmos.constants.vpc_name_regex

errors[vpc_dev_max_azs_error] {
    input.vars.stage == "dev"
    count(input.vars.availability_zones) != 2
}
```

Specify the module paths in the component's validation configuration:

```yaml
settings:
  validation:
    check-vpc:
      schema_type: opa
      schema_path: "vpc/validate-vpc-component.rego"
      module_paths:
        - "catalog/constants"
```

If `module_paths` specifies a folder, Atmos recursively loads all `.rego` files from that
folder and its subfolders.

## Atmos Manifest JSON Schema Validation

Atmos includes an embedded JSON Schema for validating the structure of Atmos manifests themselves
(not component vars, but the manifest file format). To override the embedded schema:

```yaml
# atmos.yaml
schemas:
  atmos:
    manifest: "stacks/schemas/atmos/atmos-manifest/1.0/atmos-manifest.json"
    # Also supports URLs:
    # manifest: "https://atmos.tools/schemas/atmos/atmos-manifest/1.0/atmos-manifest.json"
```

The manifest schema can also be provided via:
- Environment variable: `ATMOS_SCHEMAS_ATMOS_MANIFEST`
- CLI flag: `--schemas-atmos-manifest`

## EditorConfig Validation

Atmos supports the EditorConfig Checker for ensuring consistent coding styles. This validates
adherence to rules defined in `.editorconfig` files across the project.

## Validation in CI/CD Pipelines

### Running Validation in GitHub Actions

Add a validation step early in your CI/CD pipeline:

```yaml
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
// ... (10 lines trimmed)
        run: |
          atmos validate component vpc -s plat-ue2-dev
          atmos validate component vpc -s plat-ue2-prod
```

### Pre-Provisioning Validation

Atmos automatically runs validation before `terraform plan` and `terraform apply`. If any
validation policy fails, the operation is blocked:

```text
$ atmos terraform apply vpc -s plat-ue2-prod
Mapping public IPs on launch is not allowed in 'prod'. Set 'map_public_ip_on_launch' variable to 'false'

exit status 1
```

## Best Practices for Validation Policies

1. **Use JSON Schema for structural validation** -- Required fields, type checking, pattern matching
2. **Use OPA for business logic** -- Cross-field validation, environment-specific rules, naming conventions
3. **Organize OPA modules in a catalog** -- Reusable constants, helper functions, shared rules
4. **Apply different policies per environment** -- Stricter rules for production, relaxed for dev
5. **Set appropriate timeouts** -- Prevent slow policies from blocking operations
6. **Use descriptive error messages** -- Include the rule being violated and how to fix it
7. **Validate early in CI/CD** -- Run `atmos validate stacks` before plan/apply
8. **Version your schemas** -- Keep schema files in the same repository as stack configurations
9. **Test policies against known-good and known-bad configurations** -- Ensure policies catch what they should
10. **Use `disabled: true`** to temporarily skip a validation step during migration

## Common Validation Patterns

### Required Tags

```rego
package atmos

errors[message] {
    required_tags := ["Environment", "Team", "CostCenter"]
    tag := required_tags[_]
    not input.vars.tags[tag]
    message = sprintf("Required tag '%s' is missing", [tag])
}
```

### Resource Limits by Environment

```rego
package atmos

errors[message] {
    input.vars.stage == "dev"
// ... (7 lines trimmed)
    message = sprintf("Prod environment requires at least 2 instances, got %d", [input.vars.instance_count])
}
```

### Naming Convention Enforcement

```rego
package atmos

errors[message] {
    not re_match("^[a-z][a-z0-9-]*[a-z0-9]$", input.vars.name)
    message = sprintf("Name '%s' must be lowercase alphanumeric with hyphens, starting with a letter", [input.vars.name])
}
```

### Blocking Dangerous Operations

```rego
package atmos

errors[message] {
    count(input.cli_args) >= 2
    input.cli_args[0] == "terraform"
    input.cli_args[1] == "apply"
    input.process_env.ENVIRONMENT == "production"
    not input.process_env.DEPLOYMENT_APPROVED
    message = "Production deployments require DEPLOYMENT_APPROVED environment variable"
}
```

### Network Security Rules

```rego
package atmos

errors[message] {
    input.vars.stage == "prod"
    cidr := input.vars.allowed_cidr_blocks[_]
    cidr == "0.0.0.0/0"
    message = "Open CIDR blocks (0.0.0.0/0) are not allowed in production"
}
```

## Rego Syntax Notes

- Backslashes in regex patterns must be double-escaped in Rego strings: `\\.` not `\.`
- Use `import future.keywords.in` for the `in` keyword
- The `package atmos` declaration is required in all Atmos OPA policies
- Atmos reads the `errors` output -- if it contains any strings, the policy fails

## JSON Schema System

Atmos uses JSON Schema (Draft 2020-12) to validate stack manifests with three layers: website schema (SchemaStore), embedded schemas, and user-provided overrides. For schema file locations, IDE integration (VS Code, JetBrains), and schema structure details, see [references/schema-system.md](references/schema-system.md).

## Additional Resources

- For OPA/Rego policy examples and input structure, see [references/opa-policies.md](references/opa-policies.md)
- For JSON Schema validation patterns, see [references/json-schema.md](references/json-schema.md)
### Additional Resources

- [Schema Structure](references/schema-structure.md)
- [Schema Updates](references/schema-updates.md)
