# Makefile Structure and Organization

Use this file as the routing layer for overall Makefile organization. It points
to the focused references that now carry the detailed examples.

## Load Order

| Need | Reference |
| --- | --- |
| Top-level file order, special targets, and overall layout | `makefile-layout.md` |
| Variable assignment and automatic variables | `variables-guide.md` |
| Pattern rules, modular includes, multi-directory organization, and recipe formatting | `rules-and-modularization.md` |

## Core Rules

- Keep one obvious section order so readers can find variables, rules, and
  helper targets quickly.
- Use the same variable and rule patterns across the whole file.
- Split very large Makefiles by concern only when the include structure stays
  easy to follow.

## Quick Checks

- Can a new maintainer find the default target and toolchain variables fast?
- Are pattern rules, dependency generation, and includes grouped together?
- Is the Makefile still easier to read than the shell script it replaced?
