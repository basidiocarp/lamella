# Refactoring Patterns

Use this page as the routing layer for incremental legacy refactoring patterns.

## Load Order

| Need | Reference |
| --- | --- |
| branch by abstraction, extract service, adapter work | `branch-extract-and-adapter.md` |
| facade and repository cleanup | `facade-and-repository-patterns.md` |
| swapping algorithms or search implementations | `replace-algorithm-pattern.md` |

## Core Rules

- refactor behind seams you can test and roll back
- prefer pattern changes that reduce coupling before changing frameworks
- keep migration flags and adapters temporary, then remove them deliberately
