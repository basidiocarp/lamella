# Bash Scripting Guide

Compact guidance for writing robust Bash instead of shell scripts that fail mysteriously.

## Choose Bash Deliberately

Use Bash when:
- the runtime is modern Linux or macOS
- arrays, `[[ ... ]]`, or process substitution help
- you want clearer scripting ergonomics

Use POSIX `sh` when:
- maximum portability matters more than convenience
- the environment is minimal or embedded

## Safe Starting Point

```bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
```

This gives you:
- exit on unhandled failures
- errors for unset variables
- correct failure behavior in pipelines
- safer word splitting

## Quote Variables

```bash
cp "${source}" "${destination}"
rm -- "${file}"
echo "Value: ${value}"
```

Do not rely on unquoted variables unless you explicitly want splitting and globbing.

## Error Handling

### Simple `die`

```bash
die() {
  echo "ERROR: $*" >&2
  exit 1
}

[[ -f "${config_file}" ]] || die "Missing config: ${config_file}"
```

### Temporarily Relax `set -e`

```bash
set +e
command_that_might_fail
exit_code=$?
set -e
```

Only do this around commands that are expected to fail as part of normal control flow.

## Cleanup with `trap`

```bash
tmp_file="$(mktemp)"

cleanup() {
  local exit_code=$?
  rm -f "${tmp_file}"
  exit "${exit_code}"
}

trap cleanup EXIT
trap 'exit 130' INT TERM
```

Always trap cleanup when the script creates:
- temp files
- lock files
- background jobs

## Variables and Scope

```bash
readonly CONFIG_FILE="/etc/myapp/config.conf"

process_file() {
  local input_file="$1"
  local output_file="$2"
  grep "pattern" "${input_file}" > "${output_file}"
}
```

Use:
- `readonly` for constants
- `local` inside functions
- clear lowercase names for locals and uppercase for environment-style globals

## Parameter Expansion

```bash
name="${1:-default-name}"
config="${CONFIG_FILE:?CONFIG_FILE must be set}"
extension="${file##*.}"
basename="${file%.*}"
```

These patterns replace a lot of brittle string parsing.

## Arrays

```bash
files=("a.txt" "b.txt" "c.txt")

for file in "${files[@]}"; do
  echo "${file}"
done
```

Use arrays when:
- file names may contain spaces
- argument lists are dynamic
- you need to preserve exact boundaries

If true portability is required, avoid arrays and use positional parameters instead.

## Conditionals and Tests

```bash
if [[ -f "${file}" && -r "${file}" ]]; then
  echo "Readable file"
fi

case "${command}" in
  start|stop|restart) ;;
  *) die "Unknown command: ${command}" ;;
esac
```

Prefer `[[ ... ]]` in Bash:
- cleaner comparisons
- safer pattern matching
- fewer quoting surprises

## Command Execution

```bash
output="$(command arg1 arg2)"

while IFS= read -r line; do
  echo "${line}"
done < <(generate_lines)
```

Use:
- `$(...)` for command substitution
- process substitution when a loop needs a command stream

## Default Best Practices

```text
Start strict
Quote everything unless you mean not to
Use functions and local variables
Trap cleanup
Prefer arrays over string-built argument lists
Keep scripts small; split complex logic into functions early
```
