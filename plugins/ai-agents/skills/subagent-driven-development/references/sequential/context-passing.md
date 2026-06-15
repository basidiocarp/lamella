# Context Passing

Use this reference after each sequential step to decide what should move forward.

## Pass Forward

- Files modified, as paths
- Interfaces or entry points introduced
- Decisions that later steps must respect
- Warnings that materially affect the next step

## Omit

- Internal implementation detail that later steps can read from files directly
- Full judge reports when only the issue list matters
- Historical context that no longer affects remaining tasks

## Example

```markdown
## Completed Steps Summary

### Step 1: Define UserRepository Interface
- Files changed: `src/repositories/UserRepository.ts`
- Key outputs: interface methods and constructor contract
- Relevant for next steps:
  - implementation must accept `DatabaseConnection`
  - callers import from `src/repositories/UserRepositoryImpl`
```
