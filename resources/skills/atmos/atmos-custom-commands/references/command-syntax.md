# Custom Command Syntax

Use this page as the routing layer for `commands:` definitions in `atmos.yaml`.

## Load Order

| Need | Reference |
| --- | --- |
| top-level command fields | `command-definition-fields.md` |
| arguments and flags | `command-arguments-and-flags.md` |
| templating, steps, and nested commands | `command-templating-and-nesting.md` |

## Core Rules

- define one clear command path at a time
- keep command syntax, runtime values, and step behavior explicit
- do not bury required inputs inside long example blocks
