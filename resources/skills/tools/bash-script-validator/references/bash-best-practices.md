# Bash Best Practices

Use this reference for the validator’s high-frequency Bash fixes.

## Core Habits

- use `#!/usr/bin/env bash`
- quote variable expansions
- use `$(...)` instead of backticks
- prefer `local` inside functions
- use meaningful variable names
- comment non-obvious logic only

## Common Pitfalls

### Unquoted Variables

```bash
# Good
cp "$source" "$destination"

# Bad
cp $source $destination
```

### Missing Command Checks

```bash
command -v jq >/dev/null 2>&1 || {
  echo "jq is required" >&2
  exit 1
}
```

### Bash-Only Tests

If the script uses `[[ ... ]]`, arrays, or process substitution, be explicit
that the target shell is Bash.
