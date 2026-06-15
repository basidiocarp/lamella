# Bash Error Handling

Use this reference when the validator is explaining fragile control flow or
missing cleanup.

## Strict Mode

```bash
set -euo pipefail
IFS=$'\n\t'
```

## Traps and Cleanup

```bash
cleanup() {
  rm -f "$temp_file"
}

trap cleanup EXIT
```

## Practical Rules

- use `set -euo pipefail` unless the script has a documented reason not to
- trap cleanup for temp files or lock files
- do not ignore command failures silently
- check external dependencies before relying on them
