# Refactor Coordination

Use this reference for cross-file refactors that need clear boundaries and unblock rules.

## Pattern

1. Create tasks with explicit file ownership.
2. Set dependencies where integration must wait on foundation work.
3. Keep shared contracts explicit so downstream tasks do not guess.
4. Reserve a final integration or spec-update task for the end of the chain.
