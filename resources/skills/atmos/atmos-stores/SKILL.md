---
name: atmos-stores
description: "Configures Atmos store backends, secret-manager integrations, hook usage, and cross-component data sharing."
origin: lamella
---

# Atmos External Stores

Use this skill when Atmos needs to read or write data outside Terraform state through configured stores.

## When to Use

- Sharing configuration or outputs across components
- Pulling values from SSM, Key Vault, Secret Manager, Redis, or Artifactory
- Writing outputs to stores from hooks
- Designing cross-account or cross-region store access

## Core Rules

1. Prefer Terraform outputs for Terraform-managed data when they are sufficient.
2. Use stores for external data or explicit write-back workflows.
3. Bind cloud stores to identities instead of embedding raw credentials where possible.
4. Keep naming and key shape consistent across environments.

## Store Modes

| Need | Tool |
|------|------|
| Atmos-managed stack/component/key lookup | `!store` |
| Direct arbitrary key lookup | `!store.get` |
| Template-time lookup | `atmos.Store` |
| Write-back after apply | store hooks |

## References

- [references/store-providers.md](references/store-providers.md)
- [references/store-shape-and-keying.md](references/store-shape-and-keying.md)
- [references/cloud-secret-stores.md](references/cloud-secret-stores.md)
- [references/other-store-backends.md](references/other-store-backends.md)
