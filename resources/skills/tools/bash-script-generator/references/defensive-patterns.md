---
name: bash-defensive-patterns
description: Defensive Bash programming with strict mode, error trapping, safe variable handling, and idempotent design. Use when writing production scripts, CI/CD pipelines, or system utilities.
---

# Bash Defensive Patterns

Use these patterns when a Bash script must fail safely and behave predictably.

## Core Guardrails

```bash
#!/usr/bin/env bash
set -Eeuo pipefail
```

Use `-E` when you rely on `ERR` traps inside functions.

## Cleanup

```bash
tmpdir="$(mktemp -d)"
trap 'rm -rf -- "$tmpdir"' EXIT
```

## Variable Safety

```bash
: "${REQUIRED_VAR:?REQUIRED_VAR is not set}"
cp "$source" "$dest"
```

## Idempotent Operations

Prefer commands that are safe to rerun, like `mkdir -p`, guarded file writes,
and explicit existence checks.

## Practical Rule

Defensive Bash should reduce surprise. If a script mutates state, logs to the
wrong stream, or leaves temp files behind after failure, it is not defensive
enough.
