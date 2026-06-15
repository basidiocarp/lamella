---
name: atmos-custom-commands
description: "Defines custom Atmos CLI commands in atmos.yaml, including arguments, flags, steps, and environment variables."
origin: lamella
---

# Atmos Custom Commands

Use this skill when extending the Atmos CLI with project-specific commands. Keep the main skill focused on command shape, argument flow, and execution safety; use the references for syntax, fields, templating, and nesting details.

## When to Use

- Adding a new `commands:` entry in `atmos.yaml`
- Designing arguments, flags, or trailing-argument passthrough
- Nesting subcommands under an existing Atmos command family
- Replacing shell scripts with discoverable Atmos-native workflows

## Core Rules

1. Prefer clear command contracts over long shell-heavy step lists.
2. Keep flags and argument names stable enough to script safely.
3. Use templates for interpolation, not for hiding complex business logic.
4. Reserve nested commands for real command families, not one-off aliases.

## Core Workflow

1. Define the command name and user-facing purpose.
2. Add arguments, flags, and defaults before writing steps.
3. Keep steps small and explicit, and use environment variables only where they clarify execution.
4. Test the command with both minimal and fully populated inputs.
5. Promote repeated multi-step logic into workflows when the command stops being readable.

## Quick Commands

```shell
atmos hello
atmos terraform provision vpc -s plat-ue2-dev
```

```powershell
atmos hello
atmos terraform provision vpc -s plat-ue2-dev
```

## References

- [references/command-definition-fields.md](references/command-definition-fields.md)
- [references/command-arguments-and-flags.md](references/command-arguments-and-flags.md)
- [references/command-syntax.md](references/command-syntax.md)
- [references/command-templating-and-nesting.md](references/command-templating-and-nesting.md)
