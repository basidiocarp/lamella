# Release Notes Templates

## GitHub Release Template

```markdown
## What's Changed

### Features

{{ range .Features }}
- {{ . }}
{{ end }}

### Fixes

{{ range .Fixes }}
- {{ . }}
{{ end }}

### Improvements

{{ range .Improvements }}
- {{ . }}
{{ end }}

### Breaking Changes

{{ if .BreakingChanges }}
{{ range .BreakingChanges }}
- {{ . }}
{{ end }}
{{ else }}
- None in this release.
{{ end }}

### Upgrade Notes

1. Update dependencies and rebuild the application.
2. Review config changes before deploying to production.
3. Verify migrations, background jobs, and alerting after rollout.

**Full Changelog**: https://github.com/owner/repo/compare/v{{ .Previous }}...v{{ .Current }}
```

## Internal Release Notes Template

```markdown
# Release v2.1.0 - January 15, 2024

## Summary

This release introduces dark mode support, improves checkout performance, and
reduces flaky payment retries during peak traffic.

## Customer Impact

- Checkout pages render faster on slow connections.
- Users can switch between light and dark mode without reloading.
- Payment retry failures are surfaced more clearly in support tooling.

## Support Notes

- Watch for duplicate tickets mentioning payment state mismatches.
- If users report stale pricing, refresh the cache before escalating.
- Known issue: order-history pagination is still slower than expected.

## Rollout Checklist

- [ ] Production deploy completed
- [ ] Migrations applied
- [ ] Metrics and alerts checked
- [ ] Support team notified
- [ ] Release announcement sent

## Dependency Updates

| Package | Previous | Current | Reason                   |
| ------- | -------- | ------- | ------------------------ |
| react   | 18.2.0   | 18.3.0  | Performance improvements |
| lodash  | 4.17.20  | 4.17.21 | Security patch           |
```

## Commit Message Examples

```text
feat(auth): add OAuth2 support for Google login
fix(checkout): resolve race condition in payment processing
perf(search): reduce payload size for autosuggest
docs(release): add upgrade notes for background workers

Fixes #456
Reviewed-by: @alice
```
