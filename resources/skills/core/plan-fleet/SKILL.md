---
name: plan-fleet
description: Create implementation plans optimized for GitHub Copilot CLI fleet execution. Use when planning features, refactors, or multi-step tasks that will be delegated to Copilot agents via /delegate or /fleet. Supports model assignment, acceptance criteria tracking, and agent self-validation.
---

# Fleet Plan Generator

Create implementation plans where each task is self-contained and executable by an independent Copilot CLI agent. Plans include model assignments, acceptance criteria checkboxes, and verification requirements.

## When to Use

- Before delegating implementation to Copilot CLI `/delegate` or `/fleet`
- Multi-file features, refactors, or migrations
- Any task with 3+ independent subtasks

## Workflow

1. **Discover models** — Check available models via `claude model list` or `/models`
2. **Analyze** the request and codebase
3. **Decompose** into independent, parallelizable tasks
4. **Assign models** — Match task complexity to appropriate model
5. **Write** the plan to `.plans/<name>.md`
6. **User executes** in Copilot CLI:
   - Single task: `/delegate Implement task 1 from .plans/<name>.md`
   - All parallel: `/fleet Implement the plan in .plans/<name>.md`

---

## Model Discovery and Assignment

Before creating a plan, discover available models:

```bash
# Check available models from Copilot CLI help
copilot -h | grep -A2 "\-\-model"
```

Example output:
```
  --model <model>                     Set the AI model to use (choices: "claude-sonnet-4.6", "claude-sonnet-4.5", "claude-haiku-4.5", "claude-opus-4.6",
                                      "claude-opus-4.6-fast", "claude-opus-4.5", "claude-sonnet-4", "gemini-3-pro-preview", "gpt-5.4", "gpt-5.3-codex",
                                      "gpt-5.2-codex", "gpt-5.2", "gpt-5.1-codex-max", "gpt-5.1-codex", "gpt-5.1", "gpt-5.1-codex-mini", "gpt-5-mini", "gpt-4.1")
```

### Model Selection Guidelines

| Task Type | Recommended Models | Rationale |
|-----------|-------------------|-----------|
| Simple refactors, renames, formatting | `claude-haiku-4.5`, `gpt-5-mini` | Fast, cost-effective for mechanical changes |
| Standard implementation, tests, CRUD | `claude-sonnet-4.6`, `gpt-5.2` | Balanced capability and cost |
| Architecture, complex algorithms, security | `claude-opus-4.6`, `gpt-5.4` | Maximum reasoning for high-stakes decisions |
| Code review, validation, verification | `claude-sonnet-4.6`, `claude-opus-4.6` | Good judgment to catch issues |
| Fast iteration during development | `claude-opus-4.6-fast` | Opus capability with faster response |
| Code generation heavy tasks | `gpt-5.3-codex`, `gpt-5.2-codex` | Optimized for code output |

### Specifying Model in Tasks

Each task can specify its model using the exact model name:

```markdown
### Task 1.1: Add user model
**Model:** claude-sonnet-4.6
**Files:** src/models/user.rs (create)
...
```

If no model is specified, the executor uses its default. Always specify model for:
- Tasks requiring deep reasoning (use `claude-opus-4.6` or `gpt-5.4`)
- Simple mechanical tasks (use `claude-haiku-4.5` or `gpt-5-mini` to save cost)
- Security-sensitive tasks (use `claude-opus-4.6`)
- Code-heavy generation (use `gpt-5.3-codex` or `gpt-5.2-codex`)

---

## Plan Format

```markdown
# Plan: <title>

## Metadata
- **Created:** <date>
- **Default Model:** <e.g. claude-sonnet-4.6>
- **Estimated Tasks:** <count>

## Context
<2-3 sentences: what this plan achieves and why>

## Phases

### Phase 1: <name>
<Tasks that can run in parallel>

### Task 1.1: <title>
**Model:** <model or "default">
**Files:**
- `path/to/file.rs` (create|modify|delete)

**Context:**
<What the agent needs to know>

**Accept Criteria:**
- [ ] AC1: <verifiable outcome with command>
- [ ] AC2: <another verifiable outcome>
- [ ] AC3: <test or check that proves completion>

**Implementation Notes:**
<Decisions already made, patterns to follow>

**Verification (agent must run before completing):**
```bash
<commands agent runs to verify their own work>
```

---

### Phase 2: <name>
...

## Final Verification
```bash
<commands to verify the full plan is complete>
```

## Completion Checklist
- [ ] All Phase 1 tasks complete
- [ ] All Phase 2 tasks complete
- [ ] Final verification passes
- [ ] No lint/type errors
- [ ] Tests pass
```

---

## Acceptance Criteria Format

Every task MUST have acceptance criteria as checkboxes. Criteria must be:

### Verifiable
❌ Bad: "Code is clean"
✅ Good: "- [ ] `cargo clippy` reports no warnings"

### Specific
❌ Bad: "Tests pass"
✅ Good: "- [ ] `cargo test user_model` passes (3 new tests)"

### Actionable
❌ Bad: "Error handling is good"
✅ Good: "- [ ] All `?` operators have context via `.context()`"

### Example Accept Criteria

```markdown
**Accept Criteria:**
- [ ] AC1: File `src/models/user.rs` exists with User struct
- [ ] AC2: `cargo build` succeeds with no errors
- [ ] AC3: `cargo test user::tests` passes (should show 4 tests)
- [ ] AC4: `grep -r "pub struct User" src/` returns exactly 1 match
```

---

## Agent Self-Validation Requirements

Each task MUST include a **Verification** section that the agent runs before claiming completion:

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

### Agent Completion Protocol

Agents MUST follow this protocol before reporting task complete:

1. **Run all verification commands** from the task
2. **Check each accept criterion** — run the verification for each
3. **Mark criteria complete** — update the checkbox in the plan file:
   ```markdown
   - [x] AC1: File `src/models/user.rs` exists ✓ verified
   ```
4. **Report any failures** — if a criterion fails, fix or escalate
5. **Only then claim complete** — "Task 1.1 complete. All 4 accept criteria verified."

### Validation Command Template

Include this in every task:

```markdown
**Verification (agent must run before completing):**
```bash
# Run these commands and verify all pass before claiming done
echo "=== Verification for Task X.Y ==="

# Build/compile
<build command>

# Tests
<test command>

# Lint
<lint command>

# Accept criteria checks
<grep/test commands that verify each AC>

echo "=== All checks passed ==="
```
```

---

## Rules for Task Descriptions

Each task MUST be **self-contained** — a fresh agent with no conversation history must be able to execute it.

### Include in every task:
- **Model**: Which model to use (or "default")
- **Files**: Exact paths to read and modify
- **Context**: Relevant architecture, patterns, naming conventions
- **Accept criteria**: Checkboxes with verifiable outcomes
- **Implementation notes**: Decisions already made, patterns to follow
- **Verification**: Commands agent runs to self-validate

### Never assume:
- The agent knows your conversation history
- The agent has read other tasks in the plan
- The agent knows project conventions unless stated

### Parallelization rules:
- Tasks in the same phase MUST NOT modify the same files
- If two tasks touch the same file, they go in different phases
- Integration/wiring tasks always go in the final phase
- Test tasks can parallel with implementation if they test different modules

---

## Task Sizing

**Too small** (merge into parent):
- "Add an import statement"
- "Rename a variable"

**Right size** (1 agent, 1 PR-worthy chunk):
- "Extract JWT validation into auth/jwt.rs with tests"
- "Add pagination to the users API endpoint"

**Too large** (split further):
- "Rewrite the entire auth system"
- "Add tests to all modules"

---

## Complete Example

```markdown
# Plan: Add user preferences API

## Metadata
- **Created:** 2024-01-15
- **Default Model:** claude-sonnet-4.6
- **Estimated Tasks:** 4

## Context
Add CRUD endpoints for user preferences. The app uses Axum with SQLx.
Preferences are key-value pairs scoped to a user.

## Phases

### Phase 1: Data Layer

### Task 1.1: Create preferences table migration
**Model:** claude-haiku-4.5
**Files:**
- `migrations/003_preferences.sql` (create)

**Context:**
Existing migrations use SQLx format. See `migrations/001_users.sql` for pattern.

**Accept Criteria:**
- [ ] AC1: Migration file exists at `migrations/003_preferences.sql`
- [ ] AC2: Table has columns: id, user_id, key, value, created_at, updated_at
- [ ] AC3: Foreign key constraint on user_id references users(id)
- [ ] AC4: `sqlx migrate run` succeeds

**Verification (agent must run before completing):**
```bash
# Check file exists
ls migrations/003_preferences.sql

# Verify structure
grep -q "CREATE TABLE preferences" migrations/003_preferences.sql
grep -q "user_id" migrations/003_preferences.sql
grep -q "FOREIGN KEY" migrations/003_preferences.sql

# Run migration
sqlx migrate run
```

---

### Task 1.2: Add Preference model
**Model:** claude-sonnet-4.6
**Files:**
- `src/models/preference.rs` (create)
- `src/models/mod.rs` (modify - add export)

**Context:**
Follow pattern from `src/models/user.rs`. Use `sqlx::FromRow`.

**Accept Criteria:**
- [ ] AC1: `src/models/preference.rs` exists with Preference struct
- [ ] AC2: Struct derives `FromRow`, `Serialize`, `Deserialize`
- [ ] AC3: CRUD functions: `create`, `get_by_user`, `update`, `delete`
- [ ] AC4: `cargo build` succeeds
- [ ] AC5: `cargo test preference` passes (4 tests minimum)

**Verification (agent must run before completing):**
```bash
cargo build
cargo test preference --no-fail-fast
grep -q "pub struct Preference" src/models/preference.rs
grep -q "pub mod preference" src/models/mod.rs
```

---

### Phase 2: API Layer

### Task 2.1: Add preferences endpoints
**Model:** claude-sonnet-4.6
**Files:**
- `src/routes/preferences.rs` (create)
- `src/routes/mod.rs` (modify)
- `src/main.rs` (modify - mount routes)

**Context:**
Follow pattern from `src/routes/users.rs`. Mount at `/api/preferences`.

**Accept Criteria:**
- [ ] AC1: GET `/api/preferences` returns user's preferences
- [ ] AC2: POST `/api/preferences` creates a preference
- [ ] AC3: PUT `/api/preferences/:id` updates a preference
- [ ] AC4: DELETE `/api/preferences/:id` deletes a preference
- [ ] AC5: All endpoints require authentication
- [ ] AC6: `cargo test routes::preferences` passes

**Verification (agent must run before completing):**
```bash
cargo build
cargo test routes::preferences --no-fail-fast
grep -q "Router::new()" src/routes/preferences.rs
grep -q '"/api/preferences"' src/main.rs
```

---

## Final Verification
```bash
# Full build
cargo build --release

# All tests
cargo test --all

# Lint
cargo clippy --all-targets -- -D warnings

# Integration test (if available)
cargo test --test integration preferences
```

## Completion Checklist
- [ ] All Phase 1 tasks complete (2 tasks)
- [ ] All Phase 2 tasks complete (1 task)
- [ ] Final verification passes
- [ ] No lint/type errors
- [ ] All tests pass
```

---

## Output Location

Always save plans to `.plans/` in the project root:

```
.plans/
  <descriptive-name>.md
```

Create the directory if it doesn't exist. Use kebab-case for filenames.
