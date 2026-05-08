---
name: test-writing
description: "Run this when writing tests for new code or fixing tests after refactoring — orchestrates test creation with systematic coverage."
metadata:
  argument-hint: what tests or modules to focus on
origin: lamella
---
# Test Writing

Orchestrate test creation and test fixing for code changes.

## User Arguments

```
$ARGUMENTS
```

If nothing provided, focus on all changes in current git diff (or latest commit if clean).

## When to Use

- **Write tests**: Adding coverage for new/changed business logic
- **Fix tests**: Tests failing after refactoring, dependency updates, or logic changes
- Use `api-test-suite-builder` when the test surface is mainly REST or handler behavior

## Important Constraints

- **Focus on fixing tests** — avoid changing business logic unless clearly broken
- **Preserve test intent** — tests should still validate expected behavior
- **Complexity check**: If 2+ changed files or complex logic → orchestrate agents. If single simple file → write tests directly.

## Workflow

### 1. Preparation

1. Discover test infrastructure (README, package.json, test commands)
2. Run full test suite to establish baseline
3. Verify single test file can be run in isolation

### 2. Analysis

- Run `git status -u` (or `git show --name-status` if clean)
- Filter out non-code files
- For each changed file, analyze complexity and summarize changes

### 3. Execution

#### Simple (single file, simple change)

1. Read the target file and understand the logic
2. Review existing test files for patterns and style
3. Determine test cases needed (or what broke)
4. Write/fix tests
5. Run tests, iterate until passing

#### Complex (multiple files or complex logic)

**For writing new tests:**
1. Launch coverage-reviewer agents (parallel, one per file) to identify needed test cases
2. Launch developer agents (parallel, one per file) with test case lists
3. Launch verification agents to confirm coverage
4. Iterate on gaps

**For fixing broken tests:**
1. Parse test output to get failing test files
2. Launch developer agents (parallel, one per failing file) with context:
   - Why tests need fixing (business logic changed)
   - How to run the specific test file
   - Constraint: fix test, not business logic
3. Run full suite to verify
4. Iterate on remaining failures

### Agent Prompt Template

```
The business logic has changed and test file {FILE_PATH} is now failing.

1. Read the test file and understand what it's testing
2. Read the changed source file
3. Run the test: {TEST_COMMAND}
4. Analyze failure — outdated expectations? broken setup? actual bug?
5. Fix the test and verify it passes
6. Iterate until passing
```

## Success Criteria

- All tests pass
- Test coverage maintained or improved
- Test intent preserved
- Business logic unchanged (unless bugs found)
