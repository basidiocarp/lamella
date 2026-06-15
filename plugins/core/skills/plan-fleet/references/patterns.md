# Task Design Patterns

## Task Sizing

Use task size to determine whether a task should be delegated to a single agent or further decomposed.

**Too small** (merge into parent):
- "Add an import statement"
- "Rename a variable"
- "Update a single line of config"

These are too granular for independent execution. Combine with related work.

**Right size** (1 agent, 1 PR-worthy chunk):
- "Extract JWT validation into auth/jwt.rs with tests"
- "Add pagination to the users API endpoint"
- "Implement user model with CRUD functions and tests"

This is the sweet spot: a task one agent can complete in 15-45 minutes, verify self-sufficiently, and the result is mergeable on its own.

**Too large** (split further):
- "Rewrite the entire auth system"
- "Add tests to all modules"
- "Implement the payment subsystem"

These require coordination or multiple steps that would benefit from parallel execution.

## Parallelization Rules

Tasks in the same phase can run in parallel. Tasks in different phases run sequentially (later phases depend on earlier ones).

### Phase independence

Two tasks can run in parallel if they:
- Modify different files
- Do not create dependencies between each other
- Can be integrated independently

### File modification rules

**Tasks in the same phase MUST NOT modify the same files.** If two tasks need to touch the same file, they must go in different phases.

Example: If Task 1.1 creates `src/models/user.rs` and Task 1.2 needs to import from it, move Task 1.2 to Phase 2 so Phase 1 completes first.

### Integration tasks

Tasks that wire together the output of other tasks always go in the final phase. Examples:

- Mounting routes defined in other tasks
- Wiring dependency injection based on completed modules
- Running end-to-end integration tests

## Task Format Best Practices

### Context is critical

Each task must include enough context so a fresh agent with no conversation history can execute it:

```markdown
**Context:**
Existing migrations use SQLx format. See `migrations/001_users.sql` for pattern.
The app uses Axum for routing. Follow the pattern from `src/routes/users.rs`.
User authentication is required; see `src/middleware/auth.rs` for the guard.
```

**Avoid:**
- "Follow the existing pattern" (which pattern?)
- "Use standard practices" (standard for what?)
- "See the codebase" (too much navigation required)

### Acceptance criteria checklist

Every task MUST have verifiable acceptance criteria as checkboxes:

```markdown
**Accept Criteria:**
- [ ] AC1: File `src/models/user.rs` exists with User struct
- [ ] AC2: `cargo build` succeeds with no errors
- [ ] AC3: `cargo test user::tests` passes (should show 4 tests)
- [ ] AC4: `grep -r "pub struct User" src/` returns exactly 1 match
```

**Verifiable** means you can check it with a command.

**Specific** means you state the exact outcome, not a vague goal.

**Actionable** means an agent can run the verification themselves.

### Verification section

Include verification commands that the agent runs before completing:

```markdown
**Verification (agent must run before completing):**
```bash
# 1. Build check
cargo build 2>&1 | tail -5

# 2. Test the specific module
cargo test user_model --no-fail-fast

# 3. Lint check
cargo clippy --all-targets -- -D warnings

# 4. Verify file exists with expected content
grep -q "pub struct User" src/models/user.rs && echo "✓ User struct found"
```
```

The agent runs these commands and uses the output to verify each acceptance criterion before claiming the task is done.

## Deciding Between Tasks and Phases

### Question 1: Can these tasks run in parallel?

If YES → Same phase
If NO → Different phases (put dependent task in later phase)

### Question 2: Do these tasks modify the same files?

If YES → Different phases
If NO → Can be same phase (if no other dependencies)

### Question 3: Is task completion self-verifiable?

If YES → Include verification section
If NO → Reconsider whether the task is well-scoped

## Anti-patterns to Avoid

**Don't assume shared context** within phases:

Bad:
```markdown
### Phase 1

### Task 1.1: Create User model
...

### Task 1.2: Add User validations
# Context: Build on what Task 1.1 created
```

Better:
```markdown
### Task 1.2: Add User validations
**Files:**
- `src/models/user.rs` (modify)

**Context:**
Extend the User struct defined in `src/models/user.rs`. Add validation functions:
- `validate_email()`: check email format
- `validate_password()`: check minimum length and complexity
```

**Don't create hidden dependencies:**

Bad:
```markdown
### Phase 1
- Task 1.1: Database migration
- Task 1.2: Model implementation (depends on Task 1.1)
```

Better: Put Task 1.2 in Phase 2 to make the dependency explicit, or ensure both tasks include the context needed (e.g., Task 1.2 includes a note that the migration must run first).

**Don't over-specify implementation details:**

Bad:
```markdown
Use a HashMap to store user preferences. Iterate with `.iter()` and collect into a Vec.
```

This removes the agent's ability to choose appropriate structures. Let the agent decide as long as the acceptance criteria are met.

Better:
```markdown
Store user preferences efficiently for lookup by key and iteration. Accept criteria: O(1) lookup, serializable to JSON.
```
