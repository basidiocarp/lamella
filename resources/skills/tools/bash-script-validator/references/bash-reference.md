# Bash Reference Guide

## Overview

Bash (Bourne Again SHell) is a Unix shell and command language. This guide covers bash-specific features, syntax, and best practices.

**Official Documentation:** https://www.gnu.org/software/bash/manual/

## Bash vs POSIX Shell (sh)

Bash is a **superset** of POSIX sh with many extensions. Not all bash scripts are POSIX-compliant.

### Bash-Specific Features (NOT in POSIX sh)

1. **Arrays**
   ```bash
   # Bash only
   array=(one two three)
   echo "${array[0]}"
   declare -a indexed_array
   declare -A associative_array
   ```

2. **[[ ]] Test Construct**
   ```bash
   # Bash only - more powerful than [ ]
   if [[ "$var" == pattern* ]]; then
       echo "Matches pattern"
   fi

   # POSIX sh - use [ ]
   if [ "$var" = "exact" ]; then
       echo "Exact match"
   fi
   ```

3. **Process Substitution**
   ```bash
   # Bash only
   diff <(ls dir1) <(ls dir2)
   ```

4. **Brace Expansion**
   ```bash
   # Bash only
   echo {1..10}  # Outputs: 1 2 3 4 5 6 7 8 9 10
   mv file.{txt,bak}  # Renames file.txt to file.bak
   ```

5. **Function Keyword**
   ```bash
   # Bash style (function keyword optional)
   function myfunction {
       echo "Hello"
   }

   # POSIX sh style (no function keyword)
   myfunction() {
       echo "Hello"
   }
   ```

6. **Local Variables**
   ```bash
   # Bash only
   function myfunc {
       local var="value"
       echo "$var"
   }
   ```

7. **Extended Pattern Matching**
   ```bash
   shopt -s extglob
   # Bash only
   ?(pattern-list)  # Matches zero or one occurrence
   *(pattern-list)  # Matches zero or more occurrences
   +(pattern-list)  # Matches one or more occurrences
   @(pattern-list)  # Matches one occurrence
   !(pattern-list)  # Matches anything except pattern
   ```

8. **Advanced Parameter Expansion**
   ```bash
   # Bash supports more advanced parameter expansion
   ${var,,}    # Lowercase
   ${var^^}    # Uppercase
   ${var:0:5}  # Substring
   ${var/pattern/replacement}  # Replace first
   ${var//pattern/replacement} # Replace all
   ```

9. **Source vs Dot**
   ```bash
   source script.sh  # Bash (also works: . script.sh)
   . script.sh       # POSIX sh
   ```

10. **Bash Built-in Variables**
    ```bash
    $RANDOM     # Random number
    $SECONDS    # Seconds since script started
    $BASH_VERSION
    $BASH_SOURCE
    $FUNCNAME
    $DIRSTACK
    ```

## Core Bash Syntax

### Variables

```bash
# Assignment (no spaces around =)
var="value"
readonly CONST="constant"
declare -i integer=42
declare -r readonly_var="const"
// ... (11 lines trimmed)
result=$((5 + 3))
((var++))
((var += 5))
```

### Quoting Rules

```bash
# Double quotes: Preserve literal value except $, `, \, and !
echo "Value: $var"

# Single quotes: Preserve literal value of all characters
// ... (5 lines trimmed)
# Always quote variable expansions unless you need word splitting
cp "$file" "$destination"
```

### Control Structures

```bash
# If statement
if [[ condition ]]; then
    # commands
elif [[ condition ]]; then
    # commands
// ... (32 lines trimmed)
until [[ condition ]]; do
    # commands
done
```

### Functions

```bash
# Function definition
function_name() {
    local local_var="value"
    echo "$1"  # First argument
// ... (9 lines trimmed)
}
result=$(get_value)
```

### Error Handling

```bash
# Exit on error
set -e
set -o errexit

# Exit on undefined variable
// ... (15 lines trimmed)
    # Cleanup code
    rm -f "$temp_file"
}
```

### Input/Output Redirection

```bash
# Redirect stdout
command > file

# Redirect stderr
command 2> errors.txt
// ... (14 lines trimmed)

# Here string
grep pattern <<< "$variable"
```

## Best Practices

### 1. Use SheBang
```bash
#!/usr/bin/env bash
# Portable shebang that finds bash in PATH
```

### 2. Enable Strict Mode
```bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
```

### 3. Quote Variables
```bash
# Good
cp "$source" "$destination"

# Bad (fails with spaces)
cp $source $destination
```

### 4. Use $() Instead of Backticks
```bash
# Good
result=$(command)

# Bad
result=`command`
```

### 5. Check Command Existence
```bash
if command -v shellcheck &>/dev/null; then
    echo "ShellCheck is installed"
fi
```

### 6. Use [[ ]] for Tests
```bash
# Preferred in bash
if [[ "$var" == "value" ]]; then
    # ...
fi

# Use [ ] only for POSIX compliance
if [ "$var" = "value" ]; then
    # ...
fi
```

### 7. Handle Errors Appropriately
```bash
if ! command; then
    echo "Command failed" >&2
    exit 1
fi

command || { echo "Failed" >&2; exit 1; }
```

### 8. Use Meaningful Variable Names
```bash
# Good
user_count=10
max_retries=3

# Bad
n=10
x=3
```

### 9. Add Comments
```bash
# Explain complex logic
# Document function parameters
# Clarify non-obvious behavior
```

### 10. Use Functions for Reusability
```bash
log_error() {
    echo "[ERROR] $*" >&2
}

log_info() {
    echo "[INFO] $*"
}
```

## Common Pitfalls

### 1. Unquoted Variables
```bash
# Wrong
file=/path/with spaces/file.txt
cat $file  # Fails!

# Right
file="/path/with spaces/file.txt"
cat "$file"
```

### 2. Not Checking Return Codes
```bash
# Wrong
cd /some/directory
rm -rf *  # Dangerous if cd fails!

# Right
cd /some/directory || exit 1
rm -rf *
```

### 3. Using [ ] with Bash Features
```bash
# Wrong
if [ "$var" == pattern* ]; then  # == not in POSIX

# Right (bash)
if [[ "$var" == pattern* ]]; then

# Right (POSIX)
if [ "$var" = "exact" ]; then
```

### 4. Word Splitting Issues
```bash
# Wrong
files=$(ls *.txt)
for file in $files; do  # Breaks on spaces
    echo "$file"
done

# Right
for file in *.txt; do
    echo "$file"
done
```

### 5. Not Using Local in Functions
```bash
# Wrong - pollutes global scope
function bad {
    var="value"
}

# Right
function good {
    local var="value"
}
```

## Parameter Expansion Reference

```bash
${var}              # Value of var
${var:-default}     # Use default if var is unset
${var:=default}     # Assign default if var is unset
${var:?error}       # Error if var is unset
${var:+alternate}   # Use alternate if var is set
// ... (9 lines trimmed)
${var^^}            # Uppercase all
${var,}             # Lowercase first character
${var,,}            # Lowercase all
```

## Special Variables

```bash
$0      # Script name
$1-$9   # Positional parameters
${10}   # 10th parameter (braces required)
$#      # Number of positional parameters
$*      # All positional parameters (as single word)
$@      # All positional parameters (as separate words)
$$      # Process ID of shell
$!      # PID of last background command
$?      # Exit status of last command
$_      # Last argument of previous command
```

## Resources

- [Official GNU Bash Manual](https://www.gnu.org/software/bash/manual/)
- [Bash Guide for Beginners](http://tldp.org/LDP/Bash-Beginners-Guide/html/)
- [Advanced Bash-Scripting Guide](https://tldp.org/LDP/abs/html/)
- [ShellCheck](https://www.shellcheck.net/) - Linting tool