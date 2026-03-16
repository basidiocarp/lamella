---
name: atmos-yaml-functions
description: "YAML functions: !terraform.state, !terraform.output, !store, !store.get, !env, !exec, !include, !template, !literal, !random, !aws.*, !cwd, !repo-root. Use when using Atmos YAML functions like !terraform.output, !store, !env, !exec, or debugging function evaluation."
metadata:
  version: "1.0.0"
  references:
    - references/yaml-functions.md
---

# Atmos YAML Functions


## Contents

- [Overview](#overview)
- [Available YAML Functions](#available-yaml-functions)
- [Supported Sections](#supported-sections)
- [`!terraform.state` -- Fast State Backend Access (Recommended)](#terraformstate----fast-state-backend-access-recommended)
- [`!terraform.output` -- Remote State Access](#terraformoutput----remote-state-access)
- [`!store` -- Component-Aware Store Access](#store----component-aware-store-access)
- [`!store.get` -- Arbitrary Key Store Access](#storeget----arbitrary-key-store-access)
- [`!env` -- Environment Variables](#env----environment-variables)
- [`!exec` -- Shell Script Execution](#exec----shell-script-execution)
- [`!include` -- File Inclusion](#include----file-inclusion)
- [`!template` -- Go Template Evaluation](#template----go-template-evaluation)
- [`!literal` -- Bypass Template Processing](#literal----bypass-template-processing)
- [`!random` -- Random Number Generation](#random----random-number-generation)
- [AWS Identity Functions](#aws-identity-functions)
- [Utility Functions](#utility-functions)
- [When to Use YAML Functions vs. Go Templates](#when-to-use-yaml-functions-vs-go-templates)
- [Performance Best Practices](#performance-best-practices)
- [Additional Resources](#additional-resources)


## Overview

YAML functions are the recommended way to add dynamic behavior to Atmos stack configurations.
They use YAML explicit tags (the `!` prefix) and operate on structured data after YAML parsing.
They cannot break YAML syntax, are type-safe, and produce clear error messages.

All YAML functions support Go template expressions in their arguments. Atmos processes
templates first, then executes the YAML functions.

## Available YAML Functions

| Function | Purpose |
|----------|---------|
| `!terraform.state` | Read Terraform outputs directly from state backend (fastest, recommended) |
| `!terraform.output` | Read Terraform outputs via `terraform output` (requires init, slower) |
| `!store` | Read values from stores using component/stack/key pattern |
| `!store.get` | Read arbitrary keys from stores (no naming convention required) |
| `!env` | Read environment variables (from stack `env:` sections or OS) |
| `!exec` | Execute shell scripts and use the output |
| `!include` | Include local or remote files (YAML, JSON, HCL, text) |
| `!include.raw` | Include files as raw text regardless of extension |
| `!template` | Evaluate Go template expressions and convert JSON to YAML types |
| `!literal` | Preserve values verbatim, bypassing all template processing |
| `!random` | Generate cryptographically secure random integers |
| `!cwd` | Get the current working directory |
| `!repo-root` | Get the repository root directory |
| `!aws.account_id` | Get the current AWS account ID via STS |
| `!aws.caller_identity_arn` | Get the current AWS caller identity ARN |
| `!aws.caller_identity_user_id` | Get the AWS caller identity user ID |
| `!aws.organization_id` | Get the current AWS Organization ID |
| `!aws.region` | Get the current AWS region from SDK config |

## Supported Sections

YAML functions work in all Atmos stack manifest sections:
- `vars`, `settings`, `env`, `metadata`, `command`, `component`
- `providers`, `overrides`, `backend`, `backend_type`
- `remote_state_backend`, `remote_state_backend_type`

## `!terraform.state` -- Fast State Backend Access (Recommended)

Reads outputs directly from the Terraform state backend without initialization. Supports S3,
local, GCS, and azurerm backends. **10-100x faster** than `!terraform.output`.

```yaml
vars:
  # Two-parameter form: component + output (current stack)
  vpc_id: !terraform.state vpc vpc_id

  # Three-parameter form: component + stack + output
// ... (14 lines trimmed)

  # Bracket notation for keys with special characters
  key: !terraform.state security '.users["github-dependabot"].access_key_id'
```

## `!terraform.output` -- Remote State Access

Reads Terraform outputs by running `terraform output`. Requires Terraform initialization
(downloading providers), which is **significantly slower** than `!terraform.state`. Use
`!terraform.state` instead when your backend is supported.

```yaml
vars:
  vpc_id: !terraform.output vpc vpc_id
  vpc_id: !terraform.output vpc plat-ue2-prod vpc_id
  vpc_id: !terraform.output vpc {{ .stack }} vpc_id
  first_subnet: !terraform.output vpc .private_subnet_ids[0]
```

## `!store` -- Component-Aware Store Access

Reads values from configured stores (SSM Parameter Store, Redis, Artifactory, etc.) following
the Atmos stack/component/key naming convention:

```yaml
vars:
  vpc_id: !store prod/ssm vpc vpc_id
  vpc_id: !store prod/ssm plat-ue2-prod vpc vpc_id
  vpc_id: !store prod/ssm {{ .stack }} vpc vpc_id
  api_key: !store prod/ssm config api_key | default "not-set"
  db_host: !store prod/ssm config connection | query .host
```

## `!store.get` -- Arbitrary Key Store Access

Reads arbitrary keys from stores without following the component/stack naming convention:

```yaml
vars:
  db_password: !store.get ssm /myapp/prod/db/password
  feature_flag: !store.get ssm /features/new-feature | default "disabled"
  api_key: !store.get redis app-config | query .api.key
  config: !store.get redis "config-{{ .vars.region }}"
```

## `!env` -- Environment Variables

Reads from stack manifest `env:` sections (merged via inheritance) or OS environment variables:

```yaml
vars:
  api_key: !env API_KEY
  app_name: !env APP_NAME my-app
  description: !env 'APP_DESC "my application"'
```

Resolution order: stack manifest `env:` sections -> OS environment variables -> default value.

## `!exec` -- Shell Script Execution

Executes shell scripts and assigns the output:

```yaml
vars:
  timestamp: !exec date +%s

  # Multi-line script
  result: |
    !exec
      foo=0
      for i in 1 2 3; do
        foo+=$i
      done
      echo $foo

  # Complex types must be returned as JSON
  config: !exec get-config.sh --format json
```

## `!include` -- File Inclusion

Includes local or remote files, parsing them based on extension:

```yaml
vars:
  config: !include ./config.yaml
  vpc_defaults: !include stacks/catalog/vpc/defaults.yaml
  region_config: !include https://raw.githubusercontent.com/org/repo/main/config.yaml
  cidr: !include ./vpc_config.yaml .vars.ipv4_primary_cidr_block
  vars: !include config/prod.tfvars
  description: !include ./description.md
```

Supported protocols: local files, HTTP/HTTPS, GitHub (`github://`), S3 (`s3::`), GCS (`gcs::`),
SCP/SFTP, OCI.

## `!template` -- Go Template Evaluation

Evaluates Go template expressions and converts JSON output to proper YAML types. Essential for
handling complex outputs (maps, lists) from `atmos.Component`:

```yaml
vars:
  subnet_ids: !template '{{ toJson (atmos.Component "vpc" .stack).outputs.private_subnet_ids }}'
  config: !template '{{ toJson (atmos.Component "config" .stack).outputs.config_map }}'
  cidrs: !template '{{ toJson .settings.allowed_ingress_cidrs }}'
```

## `!literal` -- Bypass Template Processing

Preserves values exactly as written, preventing Atmos from evaluating template-like syntax:

```yaml
vars:
  annotation: !literal "{{ .Values.ingress.class }}"
  user_data: !literal "#!/bin/bash\necho ${hostname}"
  config_url: !literal "{{external.config_url}}"
```

## `!random` -- Random Number Generation

Generates cryptographically secure random integers:

```yaml
vars:
  port: !random 1024 65535
  id: !random 1000 9999
  default_random: !random
```

## AWS Identity Functions

```yaml
vars:
  account_id: !aws.account_id
  org_id: !aws.organization_id
  caller_arn: !aws.caller_identity_arn
  caller_user_id: !aws.caller_identity_user_id
  region: !aws.region
```

## Utility Functions

```yaml
vars:
  working_dir: !cwd
  repo_root: !repo-root
```

## When to Use YAML Functions vs. Go Templates

YAML functions are best for data access (`!terraform.state`, `!store`, `!env`, `!include`). Go templates are best for logic (conditionals, loops, dynamic keys). For a detailed comparison table, see the `atmos-templates` skill.

## Performance Best Practices

1. **Prefer `!terraform.state` over `!terraform.output`** -- 10-100x faster (no Terraform init)
2. **Prefer `!store` over `atmos.Component` for outputs** -- Avoids Terraform initialization
3. **All YAML functions cache results** per execution for repeated calls
4. **Cold-start errors** -- `!terraform.output` and `!store` fail if the referenced component
   is not yet provisioned. Use YQ defaults (`//`) or `| default` to handle this.

## Additional Resources

- For the full YAML functions reference with detailed syntax and examples, see [references/yaml-functions.md](references/yaml-functions.md)
