# Makefile Targets Guide

Use this file as the routing layer for target design. Load the focused
reference that matches the target problem you are solving.

## Load Order

| Need | Reference |
| --- | --- |
| Standard user-facing targets like `all`, `install`, `clean`, and `test` | `standard-targets.md` |
| `.PHONY` usage, help output, and self-documenting command surfaces | `phony-and-help-targets.md` |
| Prerequisites, order-only dependencies, pattern rules, and target-specific variables | `target-dependencies.md` |

## Core Rules

- Put the default target near the top and make it obvious.
- Declare action-only targets as `.PHONY`.
- Keep target names predictable and aligned with common GNU expectations.
- Make dependencies explicit before optimizing recipes.

## Quick Checks

- If the target is an action, it should usually be `.PHONY`.
- If a target installs files, it should respect `PREFIX` and `DESTDIR`.
- If a rule rebuilds too often, re-check prerequisite shape before tweaking
  shell commands.
