# Regex Essentials for Shell Work

Use this reference when writing regex for `grep`, `sed`, `awk`, or shell
validation tasks.

## BRE vs ERE

Most confusion comes from mixing Basic and Extended regex syntax.

| Need | BRE | ERE |
|------|-----|-----|
| One or more | `\+` | `+` |
| Zero or one | `\?` | `?` |
| Alternation | `\|` | `|` |
| Grouping | `\(...\)` | `(...)` |

Examples:

```bash
grep 'pattern' file          # BRE
grep -E 'pattern' file       # ERE
sed 's/pattern/repl/' file   # BRE
sed -E 's/pattern/repl/' file # ERE
awk '/pattern/' file         # ERE-like
```

## Common Building Blocks

```text
.        any character
^        start of line
$        end of line
[0-9]    digit
[[:digit:]] POSIX digit class
[^a-z]   negated character class
```

## Useful Patterns

```bash
grep -E '^[a-zA-Z_][a-zA-Z0-9_]*=' file      # variable assignment
grep -E '[0-9]{4}-[0-9]{2}-[0-9]{2}' file    # YYYY-MM-DD
grep -E '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+' file
```

## Practical Rule

Pick the regex flavor first, then write the pattern. Most shell regex bugs are
not logic bugs; they are flavor mismatches.
