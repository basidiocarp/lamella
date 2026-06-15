# mbake Tool Reference

`mbake` is a Makefile formatter and validator. Use it to standardize style and catch structural mistakes before review.

## Core Workflow

```bash
# Check formatting without changing files
mbake format --check Makefile

# Preview changes
mbake format --diff Makefile

# Apply formatting
mbake format Makefile

# Validate syntax
mbake validate Makefile
```

Use this order:
- check
- preview
- apply
- validate

## Install and Configure

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install mbake
mbake --version
```

Initialize config:

```bash
mbake init
```

This creates `~/.bake.toml` or lets you keep a project-specific `.bake.toml`.

## Useful Config Options

```toml
space_around_assignment = true
remove_trailing_whitespace = true
fix_missing_recipe_tabs = true
auto_insert_phony_declarations = true
group_phony_declarations = true
phony_at_top = false
```

Use project-local config when one repo intentionally diverges from your global defaults.

## What mbake Is Good At

`mbake` helps with:
- spacing and formatting consistency
- `.PHONY` insertion and grouping
- missing recipe tab fixes
- GNU Make syntax validation

## Limitations

Know the edges:
- it is GNU Make-oriented, not universal POSIX Make tooling
- some special targets like `.SUFFIXES` are not fully understood
- `format --check` and `format` can surface slightly different behavior

If you need broader policy linting, pair it with another checker instead of expecting `mbake` to be everything.

## CI Use

```bash
mbake format --check Makefile
mbake validate Makefile
```

That gives you one formatting gate and one syntax gate.
