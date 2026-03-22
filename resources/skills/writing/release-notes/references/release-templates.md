# Release Notes Templates

## GitHub Release Template

```markdown
## What's Changed

### 🚀 Features

{{ range .Features }}
// ... (30 lines trimmed)
  {{ end }}

**Full Changelog**: https://github.com/owner/repo/compare/v{{ .Previous }}...v{{ .Current }}
```

## Internal Release Notes Template

```markdown
# Release v2.1.0 - January 15, 2024

## Summary

This release introduces dark mode support and improves checkout performance
// ... (29 lines trimmed)
| ------- | ------- | ------- | ------------------------ |
| react   | 18.2.0  | 18.3.0  | Performance improvements |
| lodash  | 4.17.20 | 4.17.21 | Security patch           |
```

## Commit Message Examples

```bash
# Feature with scope
feat(auth): add OAuth2 support for Google login

# Bug fix with issue reference
fix(checkout): resolve race condition in payment processing
// ... (18 lines trimmed)

Fixes #456
Reviewed-by: @alice
```
