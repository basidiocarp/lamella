# Phase Completion and Verification Protocol

## Phase Completion Protocol

When all tasks in a phase are complete, execute the verification protocol:

### Identify Changed Files

List all files modified since the last checkpoint:

```bash
git diff --name-only <last-checkpoint-sha>..HEAD
```

### Ensure Test Coverage

For each modified file:

1. Identify corresponding test file
2. Verify tests exist for new/changed code
3. Run coverage for modified modules
4. Add tests if coverage < 80%

### Run Full Test Suite

Execute complete test suite:

```bash
pytest -v --tb=short
```

All tests must pass before proceeding.

### Generate Manual Verification Steps

Create checklist of manual verifications:

```markdown
## Phase 1 Verification Checklist

- [ ] User can register with valid email
- [ ] Invalid email shows appropriate error
- [ ] Database stores user correctly
- [ ] API returns expected response codes
```

### WAIT for User Approval

Present verification checklist to user:

```
Phase 1 complete. Please verify:
1. [ ] Test suite passes (automated)
2. [ ] Coverage meets target (automated)
3. [ ] Manual verification items (requires human)

Respond with 'approved' to continue, or note issues.
```

Do NOT proceed without explicit approval.

### Create Checkpoint Commit

After approval, create checkpoint commit:

```bash
git add -A
git commit -m "checkpoint: phase 1 complete - user-auth_20250115

Verified:
- All tests passing
- Coverage: 87%
- Manual verification approved

Phase 1 tasks:
- [x] Task 1.1: Setup database schema
- [x] Task 1.2: Implement user model
- [x] Task 1.3: Add validation logic"
```

### Record Checkpoint SHA

Update plan.md checkpoints table:

```markdown
## Checkpoints

| Phase   | Checkpoint SHA | Date       | Status   |
| ------- | -------------- | ---------- | -------- |
| Phase 1 | def5678        | 2025-01-15 | verified |
| Phase 2 |                |            | pending  |
```

## Quality Assurance Gates

Before marking any task complete, verify these gates:

### Passing Tests

- All existing tests pass
- New tests pass
- No test regressions

### Coverage >= 80%

- New code has 80%+ coverage
- Overall project coverage maintained
- Critical paths fully covered

### Style Compliance

- Code follows style guides
- Linting passes
- Formatting correct

### Documentation

- Public APIs documented
- Complex logic explained
- README updated if needed

### Type Safety

- Type hints present (if applicable)
- Type checker passes
- No type: ignore without reason

### No Linting Errors

- Zero linter errors
- Warnings addressed or justified
- Static analysis clean

### Mobile Compatibility

If applicable:

- Responsive design verified
- Touch interactions work
- Performance acceptable

### Security Audit

- No secrets in code
- Input validation present
- Authentication/authorization correct
- Dependencies vulnerability-free

## Checkpoint Verification Details

### Automated Verification

Run before requesting approval:

```bash
# Test suite
pytest -v --tb=short

# Coverage
pytest --cov=src --cov-report=term-missing

# Linting
ruff check src/ tests/

# Type checking (if applicable)
mypy src/
```

### Manual Verification Guidance

For manual items, provide specific instructions:

```markdown
## Manual Verification Steps

### User Registration

1. Navigate to /register
// ... (8 lines trimmed)
1. Enter invalid email: "notanemail"
2. Verify error message shows
3. Verify form retains other entered data
```
