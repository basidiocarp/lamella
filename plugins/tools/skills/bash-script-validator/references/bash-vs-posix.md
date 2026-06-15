# Bash vs POSIX

Use this reference when deciding whether a script is intentionally Bash-only.

## Common Bash-Only Features

- arrays: `array=(one two three)`
- associative arrays: `declare -A map`
- `[[ ... ]]` tests
- process substitution: `<(command)`
- brace expansion: `{1..10}`
- `local` variables in functions
- advanced parameter expansion like `${var,,}` or `${var//a/b}`

## Portability Rule

If the script must run under POSIX `sh`, avoid Bash-only constructs and route to
[`shell-reference.md`](./shell-reference.md) for the portable pattern instead.
