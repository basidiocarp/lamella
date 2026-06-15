# Common Shell Scripting Mistakes

Use this checklist when reviewing shell code for basic correctness risks.

## Unquoted Variables

Wrong:

```bash
cat $file
```

Right:

```bash
cat "$file"
```

## Assuming Earlier Commands Succeeded

Wrong:

```bash
cd /some/directory
rm -rf *
```

Safer:

```bash
cd /some/directory || exit 1
rm -rf ./*
```

## Mixing POSIX and Bash Syntax

If the script is `#!/bin/sh`, do not use Bash-only features like arrays,
`[[ ... ]]`, or `==` tests.

## Misusing `read`

Prefer:

```bash
while IFS= read -r line; do
  printf '%s\n' "$line"
done < file
```

## Delayed `$?` Checks

Check status immediately or use `if command; then ... fi` directly instead of
reading `$?` after other commands have already run.

## Practical Rule

Most shell bugs come from quoting, portability confusion, or unchecked failure
paths. Review those three first before chasing edge cases.
