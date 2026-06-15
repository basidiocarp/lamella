# GNU grep Reference Guide

Use this reference when validator feedback touches simple search pipelines,
existence checks, or regex-driven line filtering.

## Core Syntax

```bash
grep [OPTIONS] PATTERN [FILE...]
grep [OPTIONS] -e PATTERN ... [FILE...]
grep [OPTIONS] -f PATTERN_FILE ... [FILE...]
```

## High-Value Options

```bash
-i   # ignore case
-v   # invert match
-n   # line numbers
-c   # count matches
-l   # matching files only
-r   # recursive search
-E   # extended regex
-F   # fixed strings
-q   # quiet, exit code only
```

## Common Validator-Friendly Patterns

```bash
grep -F "literal string" file.txt
grep -rn "TODO" --include="*.sh" .
grep -q "pattern" file.txt
grep -v "^#" config.file | grep -v "^$"
grep -oE '\\b([0-9]{1,3}\\.){3}[0-9]{1,3}\\b' access.log
```

## Performance Rules

- use `-F` when the pattern is literal
- use `-q` when you only need the exit code
- exclude irrelevant directories in recursive searches

```bash
grep -r --exclude-dir={.git,node_modules} "pattern" .
```

## Common Pitfalls

### Quote Patterns

```bash
# Better
grep "$pattern" file.txt
```

### Avoid Useless Use of cat

```bash
# Good
grep pattern file.txt
```

### Handle No-Match Under `set -e`

```bash
if grep -q "pattern" file.txt; then
  echo "Found"
else
  echo "Not found"
fi
```

### Escape Regex Metacharacters or Use `-F`

```bash
grep "192\\.168\\.1\\.1" file.txt
grep -F "192.168.1.1" file.txt
```
