---
name: atmos-custom-commands
description: "Defines custom Atmos CLI commands in atmos.yaml, including arguments, flags, steps, and environment variables. Use when defining custom Atmos CLI commands, adding arguments or flags, or automating multi-step operations."
---

# Atmos Custom Commands


## Contents

- [What Custom Commands Are](#what-custom-commands-are)
- [Defining Commands in atmos.yaml](#defining-commands-in-atmosyaml)
- [Command Structure](#command-structure)
  - [Basic Command](#basic-command)
  - [Command with Flags](#command-with-flags)
  - [Boolean Flags](#boolean-flags)
  - [Flag Defaults](#flag-defaults)
  - [Trailing Arguments](#trailing-arguments)
- [Nested Subcommands](#nested-subcommands)
  - [Overriding Existing Commands](#overriding-existing-commands)
- [Environment Variables](#environment-variables)
- [Component Configuration Access](#component-configuration-access)
- [Go Templates in Steps](#go-templates-in-steps)
- [Authentication](#authentication)
- [Verbose Output](#verbose-output)
- [Working Directory](#working-directory)
- [Tool Dependencies](#tool-dependencies)
- [Common Patterns](#common-patterns)
  - [Quick Example: List Stacks](#quick-example-list-stacks)
  - [Quick Example: Security Scan with Dependencies](#quick-example-security-scan-with-dependencies)
- [Best Practices](#best-practices)
- [Additional Resources](#additional-resources)


Atmos custom commands extend the CLI with project-specific commands defined in `atmos.yaml`. They
appear in `atmos help` output alongside built-in commands, providing a unified interface for all
operational tooling in a project. Custom commands replace scattered bash scripts with a consistent,
discoverable CLI.

## What Custom Commands Are

Custom commands are user-defined CLI commands configured in the `commands` section of `atmos.yaml`.
Each command can have:

- A name and description
- Positional arguments and flags (with shorthand, required/optional, defaults)
- Boolean flags
- Environment variables (supporting Go templates)
- One or more execution steps (shell commands, also supporting Go templates)
- Nested subcommands
- Access to resolved component configuration via `component_config`
- Authentication via `identity`
- Tool dependencies
- Working directory control

Custom commands can call Atmos built-in commands, shell scripts, workflows, or any other CLI tools.
They are fully interoperable with Atmos workflows.

## Defining Commands in atmos.yaml

Commands are defined under the top-level `commands` key in `atmos.yaml`:

```yaml
# atmos.yaml
commands:
  - name: hello
    description: This command says Hello world
    steps:
      - "echo Hello world!"
```

Run it with:

```shell
atmos hello
```

## Command Structure

### Basic Command

```yaml
commands:
  - name: greet
    description: Greet a user by name
    arguments:
      - name: name
        description: Name to greet
        required: true
        default: "World"
    steps:
      - "echo Hello {{ .Arguments.name }}!"
```

```shell
atmos greet Alice        # Hello Alice!
atmos greet              # Hello World! (uses default)
```

### Command with Flags

```yaml
commands:
  - name: hello
    description: Say hello with flags
    flags:
      - name: name
        shorthand: n
        description: Name to greet
        required: true
    steps:
      - "echo Hello {{ .Flags.name }}!"
```

```shell
atmos hello --name world
atmos hello -n world
```

### Boolean Flags

```yaml
commands:
  - name: deploy
    description: Deploy with options
    flags:
      - name: dry-run
// ... (22 lines trimmed)
        {{ else }}
        terraform apply
        {{ end }}
```

```shell
atmos deploy --dry-run
atmos deploy -d
atmos deploy --auto-approve=false
```

Boolean flags render as `true` or `false` (lowercase strings) in templates.

### Flag Defaults

Both string and boolean flags support default values:

```yaml
flags:
  - name: environment
    description: Target environment
    default: "development"
  - name: force
    type: bool
    description: Force the operation
    default: false
```

When a flag has a default, users can omit it from the command line.

### Trailing Arguments

Arguments after `--` are accessible via `{{ .TrailingArgs }}`:

```yaml
commands:
  - name: ansible run
    description: Run an Ansible playbook
    arguments:
      - name: playbook
        description: Playbook to run
        default: site.yml
        required: true
    steps:
      - "ansible-playbook {{ .Arguments.playbook }} {{ .TrailingArgs }}"
```

```shell
atmos ansible run -- --limit web
# Runs: ansible-playbook site.yml --limit web
```

## Nested Subcommands

Commands can contain nested subcommands for hierarchical command structures:

```yaml
commands:
  - name: terraform
    description: Execute terraform commands
    commands:
      - name: provision
// ... (14 lines trimmed)
        steps:
          - atmos terraform plan $ATMOS_COMPONENT -s $ATMOS_STACK
          - atmos terraform apply $ATMOS_COMPONENT -s $ATMOS_STACK
```

```shell
atmos terraform provision vpc -s plat-ue2-dev
```

### Overriding Existing Commands

override built-in commands by matching their name:

```yaml
commands:
  - name: terraform
    description: Execute terraform commands
    commands:
      - name: apply
// ... (8 lines trimmed)
            required: true
        steps:
          - atmos terraform apply {{ .Arguments.component }} -s {{ .Flags.stack }} -auto-approve
```

## Environment Variables

The `env` section sets environment variables accessible in steps. Values support Go templates:

```yaml
commands:
  - name: deploy
    env:
      - key: ATMOS_COMPONENT
        value: "{{ .Arguments.component }}"
      - key: ATMOS_STACK
        value: "{{ .Flags.stack }}"
    steps:
      - atmos terraform plan $ATMOS_COMPONENT -s $ATMOS_STACK
```

## Component Configuration Access

The `component_config` section resolves the full configuration for a component in a stack,
making it available via `{{ .ComponentConfig.xxx }}` in templates:

```yaml
commands:
  - name: show-backend
    component_config:
      component: "{{ .Arguments.component }}"
      stack: "{{ .Flags.stack }}"
    steps:
      - 'echo "Backend: {{ .ComponentConfig.backend.bucket }}"'
      - 'echo "Workspace: {{ .ComponentConfig.workspace }}"'
```

Available fields: `.ComponentConfig.component`, `.ComponentConfig.backend`, `.ComponentConfig.workspace`,
`.ComponentConfig.vars`, `.ComponentConfig.settings`, `.ComponentConfig.env`, `.ComponentConfig.deps`,
`.ComponentConfig.metadata`. For the complete field reference, see
[references/command-syntax.md](references/command-syntax.md).

## Go Templates in Steps

Steps support Go template syntax. Access arguments with `{{ .Arguments.name }}`, flags with
`{{ .Flags.stack }}`, and component config with `{{ .ComponentConfig.backend.bucket }}`.

```yaml
steps:
  - "echo Hello {{ .Arguments.name }}"
  - >
    {{ if .Flags.stack }}
    atmos describe stacks --stack {{ .Flags.stack }} --format json
    {{ else }}
    atmos describe stacks --format json
    {{ end }}
```

Supports `if`/`else`, `not`, `eq`, and boolean-to-shell conversion. For complete template
examples, see [references/command-syntax.md](references/command-syntax.md).

## Authentication

Custom commands can specify an `identity` for authentication:

```yaml
commands:
  - name: deploy-infra
    description: Deploy infrastructure with admin privileges
    identity: superadmin
    arguments:
// ... (8 lines trimmed)
    steps:
      - atmos terraform plan {{ .Arguments.component }} -s {{ .Flags.stack }}
      - atmos terraform apply {{ .Arguments.component }} -s {{ .Flags.stack }} -auto-approve
```

The `identity` applies to all steps. Override at runtime:

```shell
# Use command-defined identity
atmos deploy-infra vpc -s plat-ue2-prod

# Override with different identity
atmos deploy-infra vpc -s plat-ue2-prod --identity developer

# Skip authentication
atmos deploy-infra vpc -s plat-ue2-prod --identity ""
```

The `--identity` flag is automatically added to all custom commands.

## Verbose Output

Control whether step commands are printed before execution:

```yaml
commands:
  - name: set-eks-cluster
    description: Set EKS cluster context
    verbose: false          # Don't print commands (default is true)
    steps:
      - aws eks update-kubeconfig ...
```

## Working Directory

Control where steps execute:

```yaml
commands:
  - name: build
    description: Build from repository root
    working_directory: !repo-root .
    steps:
      - make build
      - make test
```

Path resolution:
- Absolute paths used as-is
- Relative paths resolved against `base_path`
- `!repo-root .` resolves to git repository root

## Tool Dependencies

Declare tools that must be available before execution:

```yaml
commands:
  - name: lint
    description: Run tflint on components
    dependencies:
      tools:
        tflint: "0.54.0"
    steps:
      - tflint --chdir=components/terraform/{{ .Arguments.component }}
```

When you run the command, Atmos checks if the tool is installed, installs it from the toolchain registry if missing, updates PATH, and executes the steps. SemVer constraints are supported (exact version, `^1.10.0`, `latest`).

## Common Patterns

Common custom command patterns include: listing stacks/components, setting EKS cluster context,
security scanning, cost estimation, and documentation generation. For complete examples of each,
see [references/command-syntax.md](references/command-syntax.md).

### Quick Example: List Stacks

```yaml
commands:
  - name: list
    description: List stacks and components
    commands:
      - name: stacks
        description: List all Atmos stacks
        steps:
          - >
            atmos describe stacks --process-templates=false --sections none | grep -e "^\S" | sed s/://g
```

### Quick Example: Security Scan with Dependencies

```yaml
commands:
  - name: security-scan
    description: Run security scans on infrastructure code
    dependencies:
      tools:
        tflint: "0.54.0"
        checkov: "3.0.0"
    steps:
      - tflint --chdir=components/terraform
      - checkov -d components/terraform
```

## Best Practices

1. **Provide descriptive names and descriptions.** Commands show in `atmos help`, so clear
   descriptions help team members discover and understand available tooling.

2. **Use Go templates for conditional logic.** Rather than writing separate commands, use
   template conditionals to handle optional flags.

3. **Set sensible defaults.** Use the `default` attribute on arguments and flags so common
   cases require minimal input.

4. **Use component_config for context-aware commands.** When a command needs to know about
   a component's resolved configuration (backend, vars, workspace), use `component_config`
   instead of hardcoding values.

5. **Use `verbose: false` for noisy commands.** Suppress command echo for commands that produce
   a lot of output or contain sensitive information.

6. **Leverage tool dependencies.** Instead of documenting prerequisites, declare them in
   `dependencies.tools` so they are auto-installed.

7. **Organize with nested subcommands.** Use nested `commands` for related operations
   (e.g., `atmos list stacks`, `atmos list components`).

8. **Combine with workflows.** Use custom commands for atomic operations and workflows for
   multi-step orchestration. They can call each other.

## Additional Resources

- For the complete custom command YAML syntax reference, see [references/command-syntax.md](references/command-syntax.md)
