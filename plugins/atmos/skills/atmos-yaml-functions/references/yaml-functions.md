# Atmos YAML Functions

Use this page as the routing layer for Atmos YAML functions.

## Load Order

| Need | Reference |
| --- | --- |
| Terraform state and store lookups | `terraform-and-store-functions.md` |
| environment, exec, include, and file-loading behavior | `runtime-and-file-functions.md` |
| template-aware helpers and utility functions | `template-and-utility-functions.md` |

## Core Rules

- prefer native YAML functions over shelling out through `!exec`
- choose `!terraform.state` over `!terraform.output` when the backend supports
  it
- keep function usage predictable so stack files remain readable
