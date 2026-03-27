# Explicit Version Pinning

## Folder-Based Versioning

Example:

```text
components/terraform/
  vpc/
    v1/
    v2/
```

Use `metadata.name` to keep the workspace key stable while `metadata.component` changes across versions.

## Strict Version Pins

Good for:

- audit-heavy environments
- explicit rollback control
- tightly controlled release approval

Trade-off: environments drift more easily unless updates are aggressively managed.

## Source-Based Pins

Source pins in stack config are useful when the environment itself needs to own the exact module reference.

Prefer this only when the added precision is worth the extra maintenance load.
