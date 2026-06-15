# Stack Organization Patterns

Use this page as the routing layer for Atmos stack layout patterns.

## Load Order

| Need | Reference |
| --- | --- |
| basic, multi-region, and environment-oriented layouts | `stack-layouts.md` |
| organizational hierarchy, layers, and `_defaults.yaml` usage | `stack-hierarchy-and-layers.md` |

## Core Rules

- start with the smallest layout that matches the organization
- make inheritance chains obvious in the directory structure
- keep stack naming conventions aligned with the variables used in `name_template`
