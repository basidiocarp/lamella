# Bash Script Patterns

Compact bash patterns for common script shapes.

## Argument Parsing

### `getopts` for Short Flags

```bash
#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: script.sh [-f file] [-v]
EOF
}

file=""
verbose=false

while getopts ":f:vh" opt; do
  case "${opt}" in
    f) file="${OPTARG}" ;;
    v) verbose=true ;;
    h) usage; exit 0 ;;
    :) echo "Missing value for -${OPTARG}" >&2; exit 1 ;;
    \?) echo "Unknown option: -${OPTARG}" >&2; exit 1 ;;
  esac
done
shift $((OPTIND - 1))
```

Use `getopts` when:
- only short options are needed
- portability matters
- the script should stay dependency-free

### Manual Long Options

```bash
parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --config) config="$2"; shift 2 ;;
      --verbose) verbose=true; shift ;;
      --help) usage; exit 0 ;;
      --) shift; break ;;
      *) break ;;
    esac
  done
  remaining_args=("$@")
}
```

Use manual parsing when long flags improve usability and the option set is still small.

### Subcommands

```bash
cmd_start() { echo "Starting"; }
cmd_stop() { echo "Stopping"; }

main() {
  case "${1:-}" in
    start) shift; cmd_start "$@" ;;
    stop) shift; cmd_stop "$@" ;;
    *) echo "Expected subcommand: start|stop" >&2; exit 1 ;;
  esac
}
```

Use subcommands when the script acts like a small CLI, not a single operation.

## Configuration Loading

### Source-Based Config

```bash
load_config() {
  local config_file="$1"
  [[ -f "${config_file}" ]] || return 0
  # shellcheck source=/dev/null
  source "${config_file}"
}
```

Only source config you trust. This executes shell code.

### Key-Value Parser

```bash
load_kv_config() {
  local config_file="$1"
  while IFS='=' read -r key value; do
    [[ -z "${key}" || "${key}" == \#* ]] && continue
    declare -g "${key}=${value}"
  done < "${config_file}"
}
```

Use this for simple `key=value` files when you do not want executable config.

## Logging

```bash
log() {
  local level="$1"; shift
  printf '[%s] %s\n' "${level}" "$*" >&2
}

log_info()  { log INFO "$@"; }
log_warn()  { log WARN "$@"; }
log_error() { log ERROR "$@"; }
```

For machine-readable logs:

```bash
log_json() {
  printf '{"level":"%s","message":"%s"}\n' "$1" "$2" >&2
}
```

## Parallel Work

### `xargs -P`

```bash
find . -name '*.txt' -print0 | xargs -0 -P 4 -I {} bash -c 'process_file "$@"' _ {}
```

Good for simple parallel file processing.

### Background Jobs

```bash
pids=()
for file in *.txt; do
  process_file "${file}" &
  pids+=("$!")
done

for pid in "${pids[@]}"; do
  wait "${pid}"
done
```

Use this when you need explicit job tracking or per-job error handling.

## Locking

### `flock`

```bash
exec 200>/var/lock/myscript.lock
flock -n 200 || { echo "Another instance is running" >&2; exit 1; }
```

Prefer `flock` when available because it is atomic and cleaner than hand-rolled lock files.

### PID Lock File

```bash
lock_file=/var/lock/myscript.lock
echo "$$" > "${lock_file}"
trap 'rm -f "${lock_file}"' EXIT
```

Use only if `flock` is unavailable and add stale-lock detection.

## Cleanup and Signals

```bash
cleanup() {
  local exit_code=$?
  rm -f "${tmp_file:-}"
  exit "${exit_code}"
}

trap cleanup EXIT
trap 'echo "Interrupted" >&2; exit 130' INT TERM
```

## Retry Logic

```bash
retry() {
  local attempts="$1"; shift
  local delay="$1"; shift

  local n=1
  until "$@"; do
    if (( n >= attempts )); then
      return 1
    fi
    sleep "${delay}"
    ((n++))
  done
}
```

Use retries only for transient failures, not deterministic validation errors.
