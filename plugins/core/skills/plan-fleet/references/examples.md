# Complete Plan Example

## Example: Add user preferences API

This is a worked example showing a complete Fleet plan for a realistic feature: CRUD endpoints for user preferences.

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

## Key observations

- **Model selection**: Task 1.1 uses `claude-haiku-4.5` because it's a straightforward SQL migration (mechanical). Task 1.2 and 2.1 use `claude-sonnet-4.6` for model and API implementation (more reasoning).
- **Parallelization**: Phase 1 tasks both modify the data layer but touch different files (migration vs. model), so they can run in parallel. Phase 2 tasks depend on Phase 1 being complete, so they go in a separate phase.
- **Acceptance criteria**: Each task has concrete, verifiable outcomes. No vague criteria like "code is clean."
- **Verification commands**: Agents run these before claiming the task is done. The commands map directly to the acceptance criteria.
