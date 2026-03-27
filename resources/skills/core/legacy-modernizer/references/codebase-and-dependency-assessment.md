# Codebase and Dependency Assessment

## Codebase Inventory

Gather:

- major services and entry points
- highest-churn modules
- unowned or low-test areas
- build, deploy, and runtime dependencies

```python
assessment = {
    "entry_points": ["api", "worker", "admin"],
    "hotspots": ["billing", "auth", "legacy_reporting"],
    "coverage_gaps": ["billing.refunds", "admin.imports"],
}
```

## Dependency Shape

- map critical third-party libraries and pinned runtime versions
- identify circular dependencies and tightly coupled modules
- call out systems that block upgrades: old ORM, legacy queue, vendor SDK
