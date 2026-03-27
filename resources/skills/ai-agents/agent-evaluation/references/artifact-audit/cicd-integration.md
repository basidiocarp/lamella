# CI/CD Integration

Use this reference when wiring artifact audits into development and release workflows.

## Typical Layers

- Pre-commit or local quick audit
- Pull-request or merge-request audit
- Scheduled trend or quality tracking

## Rule

Keep CI audit steps aligned with the local command surface so the same check can run before commit and in automation.
