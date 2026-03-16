# Bash Script Patterns

Common patterns and templates for bash script generation.

## Table of Contents

1. [Argument Parsing Patterns](#argument-parsing-patterns)
2. [Configuration File Handling](#configuration-file-handling)
3. [Logging Frameworks](#logging-frameworks)
4. [Parallel Processing](#parallel-processing)
5. [Lock Files](#lock-files)
6. [Signal Handling](#signal-handling)
7. [Retry Logic](#retry-logic)

## Argument Parsing Patterns

### Simple getopts Pattern

```bash
#!/usr/bin/env bash
set -euo pipefail

usage() {
    cat << EOF
// ... (32 lines trimmed)
}

main "$@"
```

### Long Options Pattern

```bash
# Parse both short and long options
parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
// ... (29 lines trimmed)
    # Remaining arguments
    REMAINING_ARGS=("$@")
}
```

### Subcommand Pattern

```bash
#!/usr/bin/env bash
set -euo pipefail

cmd_start() {
    echo "Starting service..."
// ... (37 lines trimmed)
}

main "$@"
```

## Configuration File Handling

### Source-based Configuration

```bash
# config.conf file
CONFIG_VALUE="something"
MAX_RETRIES=3
API_URL="https://api.example.com"

// ... (10 lines trimmed)
}

load_config "/etc/myapp/config.conf"
```

### Key-Value Configuration Parser

```bash
# config.conf format:
# key=value
# # comments

load_config() {
// ... (11 lines trimmed)
        declare -g "${key}=${value}"
    done < "${config_file}"
}
```

### INI-style Configuration Parser

```bash
# Parse INI format [section] key=value
parse_ini() {
    local file="$1"
    local section=""

// ... (19 lines trimmed)
        fi
    done < "${file}"
}
```

## Logging Frameworks

### Simple Logging with Levels

```bash
# LOG_LEVEL: 0=DEBUG, 1=INFO (default), 2=WARN, 3=ERROR
LOG_LEVEL=${LOG_LEVEL:-1}

# Use if-form guards — the && short-circuit form returns 1 when the
# level check fails, which triggers set -e at the call site.
log_debug() { if [[ ${LOG_LEVEL} -le 0 ]]; then echo "[DEBUG] $(date '+%Y-%m-%d %H:%M:%S') $*" >&2; fi; }
log_info()  { if [[ ${LOG_LEVEL} -le 1 ]]; then echo "[INFO]  $(date '+%Y-%m-%d %H:%M:%S') $*" >&2; fi; }
log_warn()  { if [[ ${LOG_LEVEL} -le 2 ]]; then echo "[WARN]  $(date '+%Y-%m-%d %H:%M:%S') $*" >&2; fi; }
log_error() { echo "[ERROR] $(date '+%Y-%m-%d %H:%M:%S') $*" >&2; }
```

### File-based Logging

```bash
readonly LOG_FILE="${LOG_FILE:-/var/log/myscript.log}"

log_to_file() {
    local level="$1"
// ... (7 lines trimmed)
    log_to_file "INFO" "${msg}"
}
```

### Structured JSON Logging

```bash
log_json() {
    local level="$1"
    local message="$2"
    local timestamp=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
// ... (7 lines trimmed)
    log_json "INFO" "$*" >&2
}
```

## Parallel Processing

### Using xargs for Parallel Execution

```bash
# Process files in parallel
find . -name "*.txt" -print0 | xargs -0 -P 4 -I {} process_file {}

# With function export
// ... (5 lines trimmed)

find . -name "*.txt" | xargs -P 4 -I {} bash -c 'process_file "$@"' _ {}
```

### Using GNU Parallel

```bash
# Requires: apt-get install parallel

# Simple parallel execution
parallel process_file ::: file1.txt file2.txt file3.txt
// ... (7 lines trimmed)
# Control number of jobs
parallel -j 4 process_file ::: *.txt
```

### Background Jobs Pattern

```bash
# Track background jobs
pids=()

# Start jobs
for file in *.txt; do
// ... (9 lines trimmed)
        echo "Job ${pid} failed" >&2
    fi
done
```

## Lock Files

### Simple Lock File

```bash
readonly LOCK_FILE="/var/lock/myscript.lock"

acquire_lock() {
    if [[ -f "${LOCK_FILE}" ]]; then
// ... (7 lines trimmed)

acquire_lock
```

### PID-based Lock with Stale Lock Detection

```bash
acquire_lock() {
    local lock_file="/var/lock/myscript.lock"

    if [[ -f "${lock_file}" ]]; then
        local old_pid=$(cat "${lock_file}")
// ... (11 lines trimmed)
    echo $$ > "${lock_file}"
    trap 'rm -f "${lock_file}"' EXIT
}
```

### Using flock for Atomic Locking

```bash
# Requires flock command

exec 200>/var/lock/myscript.lock
flock -n 200 || { echo "Another instance is running" >&2; exit 1; }

# Script runs exclusively
# Lock is released when script exits
```

## Signal Handling

### Cleanup on Exit

```bash
cleanup() {
    local exit_code=$?
    echo "Cleaning up..." >&2

// ... (8 lines trimmed)

trap cleanup EXIT
```

### Handling Multiple Signals

```bash
handle_sigint() {
    echo "Received SIGINT, cleaning up..." >&2
    cleanup
    exit 130  # Standard exit code for SIGINT
// ... (9 lines trimmed)
trap handle_sigterm TERM
trap cleanup EXIT ERR
```

### Graceful Shutdown

```bash
SHUTDOWN=false

handle_signal() {
    echo "Shutdown signal received, finishing current work..." >&2
// ... (9 lines trimmed)

echo "Graceful shutdown complete" >&2
```

## Retry Logic

### Simple Retry with Backoff

```bash
retry() {
    local max_attempts=3
    local delay=1
    local attempt=1

// ... (14 lines trimmed)

# Usage
retry curl -f https://api.example.com/data
```

### Advanced Retry with Custom Parameters

```bash
retry_with_backoff() {
    local max_attempts="${1}"
    local delay="${2}"
    local max_delay="${3:-60}"
    shift 3
// ... (23 lines trimmed)

# Usage: retry_with_backoff MAX_ATTEMPTS INITIAL_DELAY MAX_DELAY command args...
retry_with_backoff 5 1 30 curl -f https://api.example.com/data
```

### Retry with Jitter

```bash
retry_with_jitter() {
    local max_attempts="$1"
    local base_delay="$2"
    shift 2
    local attempt=1
// ... (20 lines trimmed)

    return 1
}
```

---

## References

- [Advanced Bash-Scripting Guide](https://tldp.org/LDP/abs/html/)
- [Bash Hackers Wiki](https://wiki.bash-hackers.org/)
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)