# Go Templates

Use this page as the routing layer for Atmos Go template usage.

## Load Order

| Need | Reference |
| --- | --- |
| base syntax and available context | `template-syntax-and-context.md` |
| Atmos-specific helpers | `atmos-template-functions.md` |
| Sprig and Gomplate helpers | `sprig-and-gomplate-functions.md` |

## Core Rules

- template output must still be valid YAML after rendering
- know whether a value comes from Atmos context, Sprig, or Gomplate
- keep complex type rendering explicit
