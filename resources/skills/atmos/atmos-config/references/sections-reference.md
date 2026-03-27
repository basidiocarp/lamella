# atmos.yaml Sections

Use this page as the routing layer for top-level `atmos.yaml` sections.

## Load Order

| Need | Reference |
| --- | --- |
| base paths, stacks, workflows, and schema discovery | `paths-stacks-and-schemas.md` |
| components, commands, templates, and validation settings | `components-commands-and-templates.md` |
| auth, stores, vendoring, and toolchain settings | `auth-stores-and-toolchain.md` |

## Core Rules

- keep each section small enough that ownership and precedence are obvious
- use the skill-specific refs for deep component-type details
- prefer one source of truth for a setting instead of scattering related config
  across multiple sections
