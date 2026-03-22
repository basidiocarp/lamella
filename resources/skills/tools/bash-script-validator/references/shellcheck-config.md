---
name: shellcheck-configuration
description: ShellCheck static analysis configuration, common error codes, and suppression patterns. Use when setting up shell script linting, fixing ShellCheck warnings, or integrating into CI.
---

# ShellCheck Configuration


## Contents

- [.shellcheckrc](#shellcheckrc)
- [Common Error Codes and Fixes](#common-error-codes-and-fixes)
- [Suppressing Warnings](#suppressing-warnings)
- [Output Formats](#output-formats)
- [CI Integration](#ci-integration)
- [Parallel Checking](#parallel-checking)
- [Command-Line Options](#command-line-options)

## .shellcheckrc

Create in project root:

```
shell=bash

# Enable optional checks
enable=avoid-nullary-conditions
enable=require-variable-braces

# Disable specific warnings
disable=SC1091   # Not following sourced files
external-sources=true
```

## Common Error Codes and Fixes

### SC2086: Double quote to prevent word splitting

```bash
# Bad
for i in $list; do done

# Good
for i in "${list[@]}"; do done
```

### SC2181: Check exit code directly

```bash
# Bad
some_command
if [ $? -eq 0 ]; then echo "success"; fi

# Good
if some_command; then echo "success"; fi
```

### SC2015: Use if-then instead of && ||

```bash
# Bad
[ -f "$file" ] && echo "exists" || echo "not found"

# Good
if [ -f "$file" ]; then echo "exists"; else echo "not found"; fi
```

### SC2009: Use pgrep instead of grep

```bash
# Bad
ps aux | grep -v grep | grep myprocess

# Good
pgrep -f myprocess
```

### SC2016: Expressions don't expand in single quotes

```bash
# Bad -- literal $VAR, not expansion
echo 'Value: $VAR'

# Good
echo "Value: $VAR"
```

### SC3000+: POSIX compliance

`[[ ]]` and `local` are not POSIX. Use `case`/`[ ]` when targeting `sh`.

## Suppressing Warnings

```bash
# Suppress for next line
# shellcheck disable=SC2086
for file in $(ls -la); do echo "$file"; done

# Suppress for entire script (top of file)
# shellcheck disable=SC1091,SC2119

# Specify source path for sourced files
# shellcheck source=./helper.sh
source helper.sh
```

Always document why a suppression exists.

## Output Formats

```bash
shellcheck script.sh                    # Default human-readable
shellcheck --format=gcc script.sh       # GCC format for CI
shellcheck --format=json script.sh      # JSON for programmatic parsing
shellcheck --format=quiet script.sh     # Exit code only
```

## CI Integration

### GitHub Actions

```yaml
steps:
  - uses: actions/checkout@v4
  - name: Run ShellCheck
    run: |
      sudo apt-get install shellcheck
      find . -type f -name "*.sh" -exec shellcheck {} \;
```

### Pre-commit hook

```bash
#!/bin/bash
set -e
git diff --cached --name-only | grep '\.sh$' | while read -r script; do
    shellcheck "$script" || exit 1
done
```

## Parallel Checking

```bash
find . -name "*.sh" -print0 | xargs -0 -P 4 -n 1 shellcheck
```

## Command-Line Options

```bash
shellcheck \
  --shell=bash \              # Target shell
  --exclude=SC1091,SC2119 \   # Skip specific rules
  --enable=all \              # Enable optional checks
  --external-sources \        # Follow sourced files
  --check-sourced \           # Check sourced files
  script.sh
```

Configure for your target shell. Do not analyze bash scripts as `sh` or vice versa.
