---
name: atmos-vendoring
description: "Vendors Atmos components from Git, OCI, registries, and storage."
origin: lamella
---

# Atmos Component Vendoring

Use this skill when copying external components or artifacts into an Atmos repo. Keep the main skill focused on source selection, version pinning, and repeatable pull behavior; use the manifest reference for field-by-field detail.

## When to Use

- Creating or reviewing a `vendor.yaml`
- Pulling components from Git, OCI, S3, HTTP, or local paths
- Designing include and exclude patterns
- Choosing between pinned versions, folder versioning, or tag-driven pulls

## Core Rules

1. Prefer `vendor.yaml` over legacy per-component manifests.
2. Pin versions explicitly instead of relying on mutable branches or tags.
3. Use `included_paths` and `excluded_paths` to keep vendored output narrow.
4. Treat vendoring as a reviewed dependency update, not an implicit runtime fetch.

## Core Workflow

1. Define the source and target layout.
2. Pin the version and add any template variables needed for pathing.
3. Narrow the imported files with include and exclude patterns.
4. Test a pull for one component before scaling the manifest.
5. Review the resulting diff and commit vendored changes deliberately.

## Quick Commands

```shell
atmos vendor pull
atmos vendor pull --component vpc
atmos vendor pull --tags networking
```

```powershell
atmos vendor pull
atmos vendor pull --component vpc
atmos vendor pull --tags networking
```

## References

- [references/vendor-manifest.md](references/vendor-manifest.md)
