# Documentation Lookup Reference

## When Lookup Is Required

- unfamiliar tool integrations
- unclear platform-specific build behavior
- advanced flags or security-sensitive recipes
- external tools not covered by local references

## Internal Lookup First

```bash
sed -n '1,220p' references/patterns-guide.md
rg -n "Pattern 5|Pattern 8" references/patterns-guide.md
sed -n '1,220p' references/security-guide.md
```

## External Fallback

Use Context7 first, then web search if internal docs and Context7 both fail.
