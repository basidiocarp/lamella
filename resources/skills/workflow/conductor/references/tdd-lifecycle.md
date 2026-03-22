# TDD Task Lifecycle - Detailed Steps

## Step 1: Select Next Task

Read plan.md and identify the next pending `[ ]` task. Select tasks in order within the current phase. Do not skip ahead to later phases.

## Step 2: Mark as In Progress

Update plan.md to mark the task as `[~]`:

```markdown
- [~] **Task 2.1**: Implement user validation
```

Commit this status change separately from implementation.

## Step 3: RED - Write Failing Tests

Write tests that define the expected behavior before writing implementation:

- Create test file if needed
- Write test cases covering happy path
- Write test cases covering edge cases
- Write test cases covering error conditions
- Run tests - they should FAIL

Example:

```python
def test_validate_user_email_valid():
    user = User(email="test@example.com")
    assert user.validate_email() is True

def test_validate_user_email_invalid():
    user = User(email="invalid")
    assert user.validate_email() is False
```

## Step 4: GREEN - Implement Minimum Code

Write the minimum code necessary to make tests pass:

- Focus on making tests green, not perfection
- Avoid premature optimization
- Keep implementation simple
- Run tests - they should PASS

## Step 5: REFACTOR - Improve Clarity

With green tests, improve the code:

- Extract common patterns
- Improve naming
- Remove duplication
- Simplify logic
- Run tests after each change - they should remain GREEN

## Step 6: Verify Coverage

Check test coverage meets the 80% target:

```bash
pytest --cov=module --cov-report=term-missing
```

If coverage is below 80%:

- Identify uncovered lines
- Add tests for missing paths
- Re-run coverage check

## Step 7: Document Deviations

If implementation deviated from plan or introduced new dependencies:

- Update tech-stack.md with new dependencies
- Note deviations in plan.md task comments
- Update spec.md if requirements changed

## Step 8: Commit Implementation

Create a focused commit for the task:

```bash
git add -A
git commit -m "feat(user): implement email validation

- Add validate_email method to User class
- Handle empty and malformed emails
- Add comprehensive test coverage

Task: 2.1
Track: user-auth_20250115"
```

Commit message format:

- Type: feat, fix, refactor, test, docs, chore
- Scope: affected module or component
- Summary: imperative, present tense
- Body: bullet points of changes
- Footer: task and track references

## Step 9: Attach Git Notes

Add rich task summary as git note:

```bash
git notes add -m "Task 2.1: Implement user validation

Summary:
- Added email validation using regex pattern
- Handles edge cases: empty, no @, no domain
- Coverage: 94% on validation module

Files changed:
- src/models/user.py (modified)
- tests/test_user.py (modified)

Decisions:
- Used simple regex over email-validator library
- Reason: No external dependency for basic validation"
```

## Step 10: Update Plan with SHA

Update plan.md to mark task complete with commit SHA:

```markdown
- [x] **Task 2.1**: Implement user validation `abc1234`
```

## Step 11: Commit Plan Update

Commit the plan status update:

```bash
git add conductor/tracks/*/plan.md
git commit -m "docs: update plan - task 2.1 complete

Track: user-auth_20250115"
```

## TDD Variations by Task Type

### Data Model Tasks

```
RED: Write test for model creation and validation
GREEN: Implement model class with fields
REFACTOR: Add computed properties, improve types
```

### API Endpoint Tasks

```
RED: Write test for request/response contract
GREEN: Implement endpoint handler
REFACTOR: Extract validation, improve error handling
```

### Integration Tasks

```
RED: Write test for component interaction
GREEN: Wire components together
REFACTOR: Improve error propagation, add logging
```

### Refactoring Tasks

```
RED: Add characterization tests for current behavior
GREEN: Apply refactoring (tests should stay green)
REFACTOR: Clean up any introduced complexity
```

## Working with Existing Tests

### Extend, Don't Replace

- Keep existing tests passing
- Add new tests for new behavior
- Update tests only when requirements change

### Test Migration

When refactoring changes test structure:

1. Run existing tests (should pass)
2. Add new tests for refactored code
3. Migrate test cases to new structure
4. Remove old tests only after new tests pass

### Regression Prevention

After any change:

1. Run full test suite
2. Check for unexpected failures
3. Investigate any new failures
4. Fix regressions before proceeding
