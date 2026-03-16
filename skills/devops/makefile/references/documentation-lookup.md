````markdown
# Documentation Lookup Reference

## When REQUIRED (MUST perform lookup)

- User requests integration with unfamiliar tools, frameworks, or build systems
// ... (40 lines trimmed)

### Lookup Commands

```bash
# From skill directory:
sed -n '1,220p' references/patterns-guide.md
rg -n "Pattern 5|Pattern 8" references/patterns-guide.md
sed -n '1,220p' references/security-guide.md
```

## External Lookup (Fallback)

### context7 (for tools not in internal docs)

```
mcp__context7__resolve-library-id: "<tool-name>"
mcp__context7__query-docs: query="<integration-topic>"

# Example queries:
# - For Docker: query="dockerfile best practices"
# - For Go: query="go build ldflags"
```

### WebSearch (last resort)

```
"<specific-feature>" makefile best practices 2025
Example: "docker makefile best practices 2025"
```

**Trigger WebSearch when:** Internal docs don't cover AND context7 returns nothing.

**Note:** Document which internal docs you consulted in a comment in the generated Makefile header.

````
