# Component Organization Patterns

Use this page as the routing layer for organizing plugin components.

## Load Order

| Need | Reference |
| --- | --- |
| discovery timing, registration, and activation semantics | `component-lifecycle.md` |
| command directory shapes and manifest path strategy | `command-organization.md` |
| agent and skill layout patterns | `agent-and-skill-organization.md` |

## Core Rules

- organize by how Claude loads and uses the component, not only by filesystem
  aesthetics
- keep manifest paths and on-disk layout in sync
- split component families only when the plugin has enough surface area to
  justify the complexity
