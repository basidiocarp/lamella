# POSIX Shell Essentials

Use this reference when a script must stay portable across `/bin/sh`
implementations.

## Use POSIX Syntax

Portable shell means avoiding Bash-only features such as:

- arrays
- `[[ ... ]]`
- `==` inside test expressions
- process substitution
- brace expansion
- `source` instead of `.`

## Safe Patterns

```sh
#!/bin/sh

set -eu

file="$1"

if [ -f "$file" ]; then
    echo "found: $file"
fi
```

## Core Rules

- Quote variables: `"$var"`
- Use `=` in `[ ]` tests
- Define functions as `name() { ...; }`
- Prefer simple pipelines and redirections over shell-specific shortcuts

## Practical Rule

If the script genuinely needs Bash features, declare Bash in the shebang and
document that dependency instead of pretending the script is POSIX.
