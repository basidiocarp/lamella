# Bash Scripting Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Bash vs POSIX sh](#bash-vs-posix-sh)
3. [Strict Mode and Error Handling](#strict-mode-and-error-handling)
4. [Variables and Parameter Expansion](#variables-and-parameter-expansion)
5. [Functions and Scope](#functions-and-scope)
6. [Arrays and Associative Arrays](#arrays-and-associative-arrays)
7. [Control Structures](#control-structures)
8. [Process and Command Substitution](#process-and-command-substitution)
9. [Best Practices](#best-practices)
10. [Common Pitfalls](#common-pitfalls)

## Introduction

Bash (Bourne Again Shell) is a powerful Unix shell and command language. This guide covers modern bash scripting practices and patterns for creating robust, maintainable scripts.

## Bash vs POSIX sh

### Key Differences

**Bash-specific features (not in POSIX sh):**
- Arrays: `arr=(one two three)`
- Associative arrays: `declare -A map=([key]=value)`
- `[[` conditional expressions
- `$(( ))` arithmetic expansion with more operators
- `${var//pattern/replacement}` parameter expansion
- Process substitution: `<(command)`
- `select` keyword for menus
- `**` recursive globbing with `shopt -s globstar`

**POSIX sh compatible:**
- Basic variable assignment and substitution
- `[` test command (single brackets)
- `case` statements
- Basic parameter expansion
- Command substitution with `$()`
- Functions (with different syntax)

### When to Choose

**Use Bash when:**
- Script runs on modern Linux/macOS systems
- Need arrays or associative arrays
- Want advanced string manipulation
- Targeting bash-specific environments

**Use POSIX sh when:**
- Maximum portability required
- Running on minimal systems (embedded, containers)
- Need to run on different Unix variants
- Following strict POSIX compliance requirements

## Strict Mode and Error Handling

### Essential: set -euo pipefail

```bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
```

**Explanation:**
- `set -e` (errexit): Exit immediately if a command exits with non-zero status
- `set -u` (nounset): Treat unset variables as an error
- `set -o pipefail`: Return value of pipeline is status of last command to exit with non-zero status
- `IFS=$'\n\t'`: Set Internal Field Separator to newline and tab only (prevents word splitting issues)

### When to Disable Strict Mode Temporarily

```bash
# Disable errexit for commands that are expected to fail
set +e
command_that_might_fail
exit_code=$?
// ... (7 lines trimmed)
    echo "Command failed, but continuing..."
fi
```

### Signal Handling with trap

```bash
# Cleanup function
cleanup() {
    local exit_code=$?
    echo "Cleaning up..." >&2
    rm -f "${temp_file}"
// ... (9 lines trimmed)
temp_file=$(mktemp)

# Rest of script...
```

### Error Handling Patterns

```bash
# Pattern 1: Die function
die() {
    echo "ERROR: $*" >&2
    exit 1
}
// ... (19 lines trimmed)

check_command "jq"
check_command "curl"
```

## Variables and Parameter Expansion

### Variable Naming Conventions

```bash
# Constants - uppercase with readonly
readonly MAX_RETRIES=3
readonly CONFIG_FILE="/etc/myapp/config.conf"

# Environment variables - uppercase
// ... (9 lines trimmed)
    local input="$1"
    # ...
}
```

### Always Quote Variables

```bash
# Good - properly quoted
rm "${file}"
cp "${source}" "${destination}"
echo "Value: ${variable}"

# Bad - unquoted (prone to word splitting and globbing)
rm $file
cp $source $destination
echo "Value: $variable"
```

### Parameter Expansion

```bash
# Default values
${var:-default}          # Use default if var is unset or empty
${var:=default}          # Set var to default if unset or empty
${var:?error message}    # Exit with error message if var is unset or empty
${var:+alternative}      # Use alternative if var is set
// ... (21 lines trimmed)
${file%.*}               # /path/to/file (remove extension)
${file##*.}              # txt (extension only)
${file%/*}               # /path/to (dirname)
```

## Functions and Scope

### Function Definition

```bash
# POSIX style (portable)
function_name() {
    # function body
}

// ... (10 lines trimmed)
    # Process file
    grep "pattern" "${input_file}" > "${output_file}"
}
```

### Variable Scope

```bash
# Global variable
GLOBAL_VAR="global"

my_function() {
    # Local variable - only visible in function
// ... (10 lines trimmed)
}

my_function "arg1" "arg2"
```

### Return Values

```bash
# Functions return exit status (0-255)
check_file() {
    local file="$1"
    [[ -f "${file}" ]] && return 0 || return 1
}
// ... (19 lines trimmed)

get_data my_result
echo "${my_result}"
```

## Arrays and Associative Arrays

### Indexed Arrays (Bash-specific)

```bash
# Array creation
arr=()                          # Empty array
arr=(one two three)             # Initialize with values
arr[0]="first"                  # Assign to specific index

// ... (20 lines trimmed)

# Remove element
unset 'arr[1]'                  # Remove specific element
```

### Associative Arrays (Bash 4.0+)

```bash
# Declaration required
declare -A map

# Assignment
map[key1]="value1"
// ... (17 lines trimmed)
for key in "${!map[@]}"; do
    echo "${key}: ${map[${key}]}"
done
```

### POSIX Alternative to Arrays

```bash
# Use positional parameters
set -- one two three

# Access
echo "$1"  # one
// ... (10 lines trimmed)

# Remove first item
shift
```

## Control Structures

### Conditional Expressions

```bash
# Bash [[ ... ]] (recommended for bash)
if [[ -f "${file}" ]]; then
    echo "File exists"
fi

// ... (39 lines trimmed)
[[ condition1 && condition2 ]]  # AND
[[ condition1 || condition2 ]]  # OR
[[ ! condition ]]                # NOT
```

### case Statements

```bash
case "${var}" in
    pattern1)
        # commands
        ;;
    pattern2|pattern3)
// ... (16 lines trimmed)
        echo "Unknown type"
        ;;
esac
```

### Loops

```bash
# while loop
while condition; do
    # commands
done

// ... (26 lines trimmed)
for file in $(find . -name "*.txt"); do
    echo "${file}"
done
```

## Process and Command Substitution

### Command Substitution

```bash
# Recommended: $( ... )
result=$(command)
result=$(command arg1 arg2)

# Nested command substitution
outer=$(echo "Inner: $(echo "value")")

# Not recommended: backticks (legacy)
result=`command`
```

### Process Substitution (Bash-specific)

```bash
# <( ... ) creates a named pipe/file descriptor
# Treat command output as a file

# Compare output of two commands
// ... (5 lines trimmed)
# Output redirection with process substitution
command > >(tee stdout.log) 2> >(tee stderr.log >&2)
```

## Best Practices

### Script Structure

```bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# ============================================================================
// ... (29 lines trimmed)

# Execute main
main "$@"
```

### Always Use Quotes

```bash
# Good
echo "${variable}"
cp "${source}" "${dest}"
[[ -f "${file}" ]]

# Bad (unsafe)
echo $variable
cp $source $dest
[[ -f $file ]]
```

### Use readonly for Constants

```bash
readonly MAX_RETRIES=3
readonly CONFIG_FILE="/etc/config"
```

### Prefer $() Over Backticks

```bash
# Good
output=$(command)
result=$(first $(second))

# Bad
output=`command`
result=`first \`second\``  # Hard to read
```

### Check Command Existence

```bash
if ! command -v required_cmd &> /dev/null; then
    echo "Error: required_cmd not found" >&2
    exit 1
fi
```

### Validate Inputs

```bash
# Check argument count
if [[ $# -lt 1 ]]; then
    echo "Usage: $0 <file>" >&2
    exit 1
// ... (5 lines trimmed)
# Validate numeric input
[[ "${count}" =~ ^[0-9]+$ ]] || { echo "Count must be numeric" >&2; exit 1; }
```

## Common Pitfalls

### Word Splitting

```bash
# Problem: Filename with spaces
file="my file.txt"
rm $file           # Tries to remove "my" and "file.txt"

# Solution: Quote variables
rm "${file}"       # Correctly removes "my file.txt"
```

### Globbing

```bash
# Problem: Pattern in variable
pattern="*.txt"
echo $pattern      # Expands to list of .txt files

# Solution: Quote to prevent globbing
echo "${pattern}"  # Prints "*.txt"
```

### Useless Use of Cat (UUOC)

```bash
# Bad: Unnecessary cat
cat file.txt | grep "pattern"

# Good: Direct input
// ... (9 lines trimmed)
    echo "${line}"
done < file.txt
```

### Not Handling Spaces in Filenames

```bash
# Bad: Will break on filenames with spaces
for file in $(find . -name "*.txt"); do
    process "${file}"
done
// ... (8 lines trimmed)
    process "${file}"
done
```

### Ignoring Command Exit Status

```bash
# Bad: Ignoring failure
command_that_might_fail
next_command

// ... (8 lines trimmed)
# Or with errexit
command_that_might_fail || { echo "Failed" >&2; exit 1; }
```

---

## References

- [GNU Bash Manual](https://www.gnu.org/software/bash/manual/bash.html)
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- [ShellCheck](https://www.shellcheck.net/) - Script analysis tool
- [Bash Guide for Beginners](https://tldp.org/LDP/Bash-Beginners-Guide/html/)