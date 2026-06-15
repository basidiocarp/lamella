# iOS Storage and Sync

Use iCloud Documents as the default shared workspace for single-user mobile
agent apps. It gives you transparent files, offline access, and cross-device
sync without building a custom backend first.

## Recommended Layout

```text
iCloud Drive/
└── YourApp/
    └── Documents/
        ├── tasks/
        ├── sessions/
        ├── artifacts/
        └── context.md
```

Keep the directories domain-oriented. Do not split them into `agent_created/`
and `user_created/`.

## Baseline Implementation

```swift
func workspaceRoot() -> URL {
    if let ubiquityRoot = FileManager.default
        .url(forUbiquityContainerIdentifier: nil)?
        .appendingPathComponent("Documents") {
        return ubiquityRoot
    }

    return FileManager.default.urls(
        for: .documentDirectory,
        in: .userDomainMask
    )[0]
}
```

## File-State Rules

- Create the same directory structure in iCloud and local fallback storage.
- Store durable artifacts as files, not only in transient app memory.
- Re-read files before overwriting them so user edits are preserved.
- Keep secrets and high-risk tokens out of iCloud documents. Use Keychain or
  encrypted local storage for those values.

## When to Avoid iCloud Documents

- Shared multi-user collaboration that needs server arbitration.
- High-frequency write streams where sync latency would create churn.
- Large binary assets better handled by object storage or CloudKit assets.
- Sensitive credentials or regulated data that should not live in user-visible
  files.
