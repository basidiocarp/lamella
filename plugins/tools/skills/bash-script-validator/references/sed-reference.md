# `sed` Essentials

Use `sed` for simple stream edits, substitutions, deletions, and in-place text
updates.

## Core Forms

```bash
sed 's/old/new/' file
sed -n '5,10p' file
sed '/pattern/d' file
sed -i.bak 's/old/new/g' file
```

## Common Commands

- `s` substitute
- `d` delete
- `p` print
- `a` append
- `i` insert
- `c` change

## BRE vs ERE

Default `sed` syntax is BRE. Use `-E` when extended regex makes the pattern
simpler.

```bash
sed 's/[0-9]\+/X/g' file
sed -E 's/[0-9]+/X/g' file
```

## Practical Rules

- Prefer a different delimiter when paths contain `/`.
- Use `-n` when you only want selected output.
- Use `-i.bak` instead of bare `-i` if the edit is hard to undo.
- Keep multi-step `sed` logic in a script file once the one-liner stops being
  obvious.
