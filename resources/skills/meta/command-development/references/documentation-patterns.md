# Command Documentation Patterns

Use this page as the routing layer for command documentation.

## Load Order

| Need | Reference |
| --- | --- |
| embedded documentation inside the command file | `in-command-documentation.md` |
| help text, usage examples, and error guidance | `help-and-error-guidance.md` |
| maintenance notes, changelog habits, and README docs | `maintenance-and-readme-docs.md` |

## Core Rules

- keep the command self-explanatory at the point of use
- document edge cases where the user will hit them
- separate maintainer notes from user-facing help
- update examples when the command behavior changes
