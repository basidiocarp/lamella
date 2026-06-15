# ShellCheck Essentials

Use ShellCheck to catch quoting bugs, portability issues, and unsafe shell
patterns before the script ships.

## Basic Usage

```bash
shellcheck script.sh
shellcheck -s bash script.sh
shellcheck -S warning script.sh
```

## Common Fixes

- `SC2086`: quote variables
- `SC2162`: use `read -r`
- `SC2164`: handle failed `cd`
- `SC2181`: test commands directly instead of checking `$?` later

## Dialect Rule

Set the right shell dialect. A `sh` script and a Bash script should not be
linted with the same assumptions.

## Practical Rule

ShellCheck is strongest when it is part of the normal edit loop, not a once-a-
release cleanup pass.
