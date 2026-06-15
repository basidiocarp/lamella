# Terraform Backend Configuration

Use this page as the routing layer for Atmos-managed Terraform backends.

## Load Order

| Need | Reference |
| --- | --- |
| configuration hierarchy and override behavior | `backend-hierarchy.md` |
| supported backend types | `backend-type-catalog.md` |
| generated files, keys, and workspace behavior | `backend-generation-and-keys.md` |

## Core Rules

- keep backend settings in stacks, not hardcoded in modules
- understand override order before debugging a generated backend file
- choose backend types and key layout deliberately
