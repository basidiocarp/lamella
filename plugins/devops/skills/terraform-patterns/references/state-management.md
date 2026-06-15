# Terraform State Management

Use this file as the routing layer for Terraform state handling.

## Load Order

| Need | Reference |
| --- | --- |
| Remote backends, workspace usage, backend config files, and lock behavior | `state-backends-and-workspaces.md` |
| Imports, state migration, force unlock, encryption, and access control | `state-operations-and-security.md` |

## Core Rules

- Production state should live in a remote backend with locking.
- Keep backend configuration repeatable and environment-aware.
- Treat manual state operations as controlled maintenance, not routine workflow.
- Secure state with the same care as secrets and infrastructure credentials.
