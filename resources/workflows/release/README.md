# Release Workflows

Workflows for preparing and executing releases.

These release workflows currently live as source-side playbooks. They are not
bundled into the shipped `core` plugin manifest.

## Workflows

| File | Description |
|------|-------------|
| `RELEASE-PREP.md` | Release preparation checklist |

## Release Process

1. **Preparation**
   - Version bump
   - Changelog generation
   - Documentation update
   - Final testing

2. **Validation**
   - QA sign-off
   - Security review
   - Performance verification

3. **Execution**
   - Tag release
   - Deploy to staging
   - Deploy to production
   - Monitor

## See Also

- [Quality workflows](../quality/) - Pre-deploy checks
- Shared Lamella release scripts have been retired; keep release automation next
  to the release workflow that owns it.
