---
name: bash-defensive-patterns
description: Defensive Bash programming with strict mode, error trapping, safe variable handling, and idempotent design. Use when writing production scripts, CI/CD pipelines, or system utilities.
---

# Bash Defensive Patterns


## Contents

- [Strict Mode](#strict-mode)
- [Error Trapping and Cleanup](#error-trapping-and-cleanup)
- [Variable Safety](#variable-safety)
- [Safe Array Handling](#safe-array-handling)
- [Script Directory Detection](#script-directory-detection)
- [Safe Temporary Files](#safe-temporary-files)
- [Argument Parsing](#argument-parsing)
- [Structured Logging](#structured-logging)
- [Process Orchestration with Signals](#process-orchestration-with-signals)
- [Atomic File Writes](#atomic-file-writes)
- [Dry-Run Support](#dry-run-support)
- [Dependency Checking](#dependency-checking)
- [NUL-Safe File Iteration](#nul-safe-file-iteration)

## Strict Mode

Every script starts with this:

```bash
#!/bin/bash
set -Eeuo pipefail
```

`-E` inherits ERR trap in functions. `-e` exits on error. `-u` exits on undefined variables. `-o pipefail` fails pipe if any command fails.

## Error Trapping and Cleanup

```bash
trap 'echo "Error on line $LINENO"' ERR
trap 'rm -rf "$TMPDIR"' EXIT

TMPDIR=$(mktemp -d)
```

## Variable Safety

```bash
# Always quote to prevent word splitting and globbing
cp "$source" "$dest"

# Fail with message if required var is unset
: "${REQUIRED_VAR:?REQUIRED_VAR is not set}"

# Test for unset-or-empty safely
if [[ -z "${VAR:-}" ]]; then
    echo "VAR is not set or is empty"
fi
```

## Safe Array Handling

```bash
declare -a items=("item 1" "item 2" "item 3")
for item in "${items[@]}"; do
    echo "Processing: $item"
done

# Read command output into array safely
mapfile -t lines < <(some_command)
```

## Script Directory Detection

```bash
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
```

## Safe Temporary Files

```bash
trap 'rm -rf -- "$TMPDIR"' EXIT
TMPDIR=$(mktemp -d) || { echo "ERROR: Failed to create temp dir" >&2; exit 1; }
```

## Argument Parsing

```bash
VERBOSE=false
DRY_RUN=false
OUTPUT_FILE=""

while [[ $# -gt 0 ]]; do
// ... (8 lines trimmed)
done

[[ -n "$OUTPUT_FILE" ]] || { echo "ERROR: -o/--output is required" >&2; usage 1; }
```

## Structured Logging

```bash
log_info()  { echo "[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $*" >&2; }
log_warn()  { echo "[$(date +'%Y-%m-%d %H:%M:%S')] WARN: $*" >&2; }
log_error() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $*" >&2; }
log_debug() { [[ "${DEBUG:-0}" == "1" ]] && echo "[$(date +'%Y-%m-%d %H:%M:%S')] DEBUG: $*" >&2; }
```

## Process Orchestration with Signals

```bash
PIDS=()

cleanup() {
    for pid in "${PIDS[@]}"; do
        kill -0 "$pid" 2>/dev/null && kill -TERM "$pid" 2>/dev/null || true
// ... (8 lines trimmed)
background_task &
PIDS+=($!)
wait
```

## Atomic File Writes

```bash
atomic_write() {
    local -r target="$1"
    local tmpfile
    tmpfile=$(mktemp) || return 1
    cat > "$tmpfile"
    mv "$tmpfile" "$target"
}
```

## Dry-Run Support

```bash
DRY_RUN="${DRY_RUN:-false}"

run_cmd() {
    if [[ "$DRY_RUN" == "true" ]]; then
        echo "[DRY RUN] Would execute: $*"
        return 0
    fi
    "$@"
}
```

## Dependency Checking

```bash
check_dependencies() {
    local -a missing=()
    local -a required=("jq" "curl" "git")

    for cmd in "${required[@]}"; do
        command -v "$cmd" &>/dev/null || missing+=("$cmd")
    done

    if [[ ${#missing[@]} -gt 0 ]]; then
        echo "ERROR: Missing required commands: ${missing[*]}" >&2
        return 1
    fi
}
```

## NUL-Safe File Iteration

```bash
while IFS= read -r -d '' file; do
    echo "Processing: $file"
done < <(find /path -type f -print0)
```

Design scripts for idempotency. Use `mkdir -p`, check existence before creating, and make rerunning safe.
