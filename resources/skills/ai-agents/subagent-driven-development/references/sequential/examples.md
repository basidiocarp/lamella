# Examples

> Detailed execution examples for sequential orchestration

## Example 1: Interface Change with Consumer Updates

**Input:**

```
/do-in-steps Change the return type of UserService.getUser() from User to UserDTO and update all consumers
```

### Phase 1 - Decomposition

| Step | Subtask | Depends On | Complexity | Type | Output |
|------|---------|------------|------------|------|--------|
| 1 | Create UserDTO class with proper structure | - | Medium | Implementation | New UserDTO.ts file |
| 2 | Update UserService.getUser() to return UserDTO | Step 1 | High | Implementation | Modified UserService |
| 3 | Update UserController to handle UserDTO | Step 2 | Medium | Refactoring | Modified UserController |
| 4 | Update tests for UserService and UserController | Steps 2,3 | Medium | Testing | Updated test files |

### Phase 2 - Model Selection

| Step | Subtask | Model | Agent | Rationale |
|------|---------|-------|-------|-----------|
| 1 | Create DTO | sonnet | sdd:developer | Medium complexity, standard pattern |
| 2 | Update Service | opus | sdd:developer | High risk, core service change |
| 3 | Update Controller | sonnet | sdd:developer | Medium complexity, follows patterns |
| 4 | Update Tests | sonnet | sdd:tdd-developer | Test expertise |

### Phase 3 - Execution with Judge Verification

```
Step 1: Create UserDTO
  Implementation (Sonnet)...
    -> Created UserDTO.ts with id, name, email, createdAt fields
  Judge Verification (Sonnet)...
    -> VERDICT: PASS, SCORE: 4.2/5.0
// ... (26 lines trimmed)
  Judge Verification (Sonnet)...
    -> VERDICT: PASS, SCORE: 4.3/5.0
  -> All steps complete
```

### Final Summary

- Total Agents: 9 (4 implementations + 1 retry + 4 judges)
- Steps with Retries: Step 2 (1 retry)
- All Judge Scores: 4.2, 4.5, 4.0, 4.3

---

## Example 2: Feature Addition Across Layers

**Input:**

```
/do-in-steps Add email notification capability to the order processing system
```

### Phase 1 - Decomposition

| Step | Subtask | Depends On | Complexity | Type | Output |
|------|---------|------------|------------|------|--------|
| 1 | Create EmailService with send capability | - | Medium | Implementation | New EmailService class |
| 2 | Add notification triggers to OrderService | Step 1 | Medium | Implementation | Modified OrderService |
| 3 | Create email templates for order events | Step 2 | Low | Documentation | Template files |
| 4 | Add configuration and environment variables | Step 1 | Low | Configuration | Updated config files |
| 5 | Add integration tests for email flow | Steps 1-4 | Medium | Testing | Test files |

### Phase 2 - Model Selection

| Step | Subtask | Impl Model | Judge Model | Rationale |
|------|---------|------------|-------------|-----------|
| 1 | EmailService | sonnet | sonnet | Standard implementation |
| 2 | Notification triggers | sonnet | sonnet | Business logic |
| 3 | Email templates | haiku | haiku | Simple content |
| 4 | Configuration | haiku | haiku | Mechanical updates |
| 5 | Integration tests | sonnet | sonnet | Test expertise |

### Phase 3 - Execution Summary

| Step | Subtask | Judge Score | Retries | Status |
|------|---------|-------------|---------|--------|
| 1 | EmailService | 4.1/5.0 | 0 | ✅ PASS |
| 2 | Notification triggers | 3.8/5.0 | 1 | ✅ PASS |
| 3 | Email templates | 4.5/5.0 | 0 | ✅ PASS |
| 4 | Configuration | 4.2/5.0 | 0 | ✅ PASS |
| 5 | Integration tests | 4.0/5.0 | 0 | ✅ PASS |

Total Agents: 11 (5 implementations + 1 retry + 5 judges)

---

## Example 3: Multi-file Refactoring with Escalation

**Input:**

```
/do-in-steps Rename 'userId' to 'accountId' across the codebase - this affects interfaces, implementations, and callers
```

### Phase 1 - Decomposition

| Step | Subtask | Depends On | Complexity | Type | Output |
|------|---------|------------|------------|------|--------|
| 1 | Update interface definitions | - | High | Refactoring | Updated interfaces |
| 2 | Update implementations of those interfaces | Step 1 | Low | Refactoring | Updated implementations |
| 3 | Update callers and consumers | Step 2 | Low | Refactoring | Updated caller files |
| 4 | Update tests | Step 3 | Low | Testing | Updated test files |
| 5 | Update documentation | Step 4 | Low | Documentation | Updated docs |

### Phase 2 - Model Selection

| Step | Subtask | Impl Model | Judge Model | Rationale |
|------|---------|------------|-------------|-----------|
| 1 | Update interfaces | opus | sonnet | Breaking changes need careful handling |
| 2 | Update implementations | haiku | haiku | Mechanical rename |
| 3 | Update callers | haiku | haiku | Mechanical updates |
| 4 | Update tests | haiku | haiku | Mechanical test fixes |
| 5 | Update documentation | haiku | haiku | Simple text updates |

### Phase 3 - Execution with Escalation

```
Step 1: Update interfaces
  -> Judge: PASS, 4.3/5.0

Step 2: Update implementations
  -> Judge: PASS, 4.0/5.0
// ... (16 lines trimmed)
  Attempt 4 (with user guidance): Judge PASS, 4.1/5.0

Step 4-5: Complete without issues
```

Total Agents: 14 (5 implementations + 4 retries + 5 judges)
