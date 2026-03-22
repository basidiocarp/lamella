# Dynamic Arguments and File References

Complete reference for handling arguments and file references in Claude Code slash commands.

## Dynamic Arguments

### Using $ARGUMENTS

Capture all arguments as single string:

```markdown
---
description: Fix issue by number
argument-hint: [issue-number]
---

Fix issue #$ARGUMENTS following our coding standards and best practices.
```

**Usage:**
```
> /fix-issue 123
> /fix-issue 456
```

**Expands to:**
```
Fix issue #123 following our coding standards...
Fix issue #456 following our coding standards...
```

### Using Positional Arguments

Capture individual arguments with `$1`, `$2`, `$3`, etc.:

```markdown
---
description: Review PR with priority and assignee
argument-hint: [pr-number] [priority] [assignee]
---

Review pull request #$1 with priority level $2.
After review, assign to $3 for follow-up.
```

**Usage:**
```
> /review-pr 123 high alice
```

**Expands to:**
```
Review pull request #123 with priority level high.
After review, assign to alice for follow-up.
```

### Combining Arguments

Mix positional and remaining arguments:

```markdown
Deploy $1 to $2 environment with options: $3
```

**Usage:**
```
> /deploy api staging --force --skip-tests
```

**Expands to:**
```
Deploy api to staging environment with options: --force --skip-tests
```

### Argument Reference Summary

| Syntax | Description | Example |
|--------|-------------|---------|
| `$ARGUMENTS` | All arguments as string | `Fix #$ARGUMENTS` |
| `$1` | First argument | `Deploy $1` |
| `$2` | Second argument | `to $2 environment` |
| `$3` | Third+ arguments | `with options: $3` |

## File References

### Using @ Syntax

Include file contents in command:

```markdown
---
description: Review specific file
argument-hint: [file-path]
---

Review @$1 for:
- Code quality
- Best practices
- Potential bugs
```

**Usage:**
```
> /review-file src/api/users.ts
```

**Effect:** Claude reads `src/api/users.ts` before processing command

### Multiple File References

Reference multiple files:

```markdown
Compare @src/old-version.js with @src/new-version.js

Identify:
- Breaking changes
- New features
- Bug fixes
```

### Static File References

Reference known files without arguments:

```markdown
Review @package.json and @tsconfig.json for consistency

Ensure:
- TypeScript version matches
- Dependencies are aligned
- Build configuration is correct
```

### File Reference Summary

| Pattern | Description | Example |
|---------|-------------|---------|
| `@$1` | Dynamic file from argument | `Review @$1` |
| `@path/file.ts` | Static file reference | `Check @package.json` |
| Multiple `@` | Multiple file references | `Compare @a.ts with @b.ts` |

## Best Practices

### Argument Handling

1. **Validate arguments:** Check for required arguments in prompt
2. **Provide defaults:** Suggest defaults when arguments missing
3. **Document format:** Explain expected argument format
4. **Handle edge cases:** Consider missing or invalid arguments

```markdown
---
argument-hint: [pr-number]
---

$IF($1,
  Review PR #$1,
  Please provide a PR number. Usage: /review-pr [number]
)
```

### File References

1. **Explicit paths:** Use clear file paths
2. **Check existence:** Handle missing files gracefully
3. **Relative paths:** Use project-relative paths
4. **Glob support:** Consider using Glob tool for patterns
