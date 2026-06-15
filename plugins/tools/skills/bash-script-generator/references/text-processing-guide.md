# Text Processing Guide

Use this file as the routing page for `grep`, `awk`, and `sed` choices in the
generator skill.

## Open These References By Task

1. [tool-selection.md](./tool-selection.md)
   Use when deciding whether the script should use `grep`, `awk`, `sed`, or a
   higher-level language.
2. [grep-recipes.md](./grep-recipes.md)
   Use for pattern filtering, log extraction, and quick match pipelines.
3. [awk-recipes.md](./awk-recipes.md)
   Use for field-based parsing, calculations, and report generation.
4. [sed-recipes.md](./sed-recipes.md)
   Use for substitutions, deletions, and lightweight line rewrites.

## Practical Rule

If the script is moving beyond one-pass text manipulation into nested state or
complex transforms, stop and consider Python instead of forcing shell tools too
far.
