# Script Generation Best Practices

Use this checklist when generating a new Bash script.

## Start With a Safe Skeleton

```bash
#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "usage: script.sh <arg>" >&2
}

main() {
  local input="${1:?missing input}"
  printf 'input=%s\n' "$input"
}

main "$@"
```

## Core Rules

- Quote every variable expansion unless unquoted splitting is intentional.
- Validate inputs before calling external tools.
- Keep `main` small and move reusable work into named functions.
- Add cleanup with `trap` when the script creates temp files or directories.
- Prefer clear usage text over clever argument parsing.

## Security Rules

- Never interpolate untrusted input into `eval`.
- Use `--` when passing user input to commands that parse flags.
- Prefer arrays for command assembly in Bash.
- Set `IFS=$'\n\t'` only when the script actually benefits from the narrower
  split behavior.

## Practical Rule

Generated scripts should be boring, explicit, and easy to audit. Optimize for
clarity first and only add complexity when the use case proves it is needed.
