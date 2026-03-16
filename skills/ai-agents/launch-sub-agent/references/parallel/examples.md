# Parallel Executor Examples

Complete execution examples for common scenarios.

## Example 1: Code Simplification

**Input:**
```
/do-in-parallel "Simplify error handling to use early returns" \
  --files "src/services/user.ts,src/services/order.ts,src/services/payment.ts"
```

**Analysis:**
- Task type: Code transformation / refactoring
- Per-target complexity: Medium (pattern-based)
- Independence: Yes (separate files)

**Model Selection:** Sonnet

**Result:**
```markdown
## Parallel Execution Summary

### Configuration
- **Task:** Simplify error handling to use early returns
- **Model:** Sonnet
// ... (9 lines trimmed)

- **Completed:** 3/3
- **Common patterns:** All files used consistent early return pattern
```

---

## Example 2: Documentation Generation

**Input:**
```
/do-in-parallel "Generate JSDoc documentation for all public methods" \
  --files "src/api/users.ts,src/api/products.ts,src/api/orders.ts,src/api/auth.ts"
```

**Analysis:**
- Task type: Documentation generation
- Complexity: Low (mechanical)
- Independence: Yes

**Model Selection:** Haiku (mechanical task)

---

## Example 3: Security Analysis

**Input:**
```
/do-in-parallel "Analyze for SQL injection vulnerabilities and suggest fixes" \
  --files "src/db/queries.ts,src/db/migrations.ts,src/api/search.ts"
```

**Analysis:**
- Task type: Security analysis
- Complexity: High (security-critical)
- Independence: Yes

**Model Selection:** Opus (critical reasoning required)

---

## Example 4: Test Generation

**Input:**
```
/do-in-parallel "Generate unit tests achieving 80% coverage" \
  --targets "UserService,OrderService,PaymentService,NotificationService"
```

**Analysis:**
- Task type: Test generation
- Complexity: Medium
- Output size: Large
- Independence: Yes

**Model Selection:** Sonnet (extensive but patterned)

---

## Example 5: Inferred Targets

**Input:**
```
/do-in-parallel "Apply consistent logging format to src/handlers/user.ts, src/handlers/order.ts, and src/handlers/product.ts"
```

**Analysis:**
- Targets inferred: 3 files from task description
- Complexity: Low
- Independence: Yes

**Model Selection:** Haiku (simple, mechanical)

---

## Error Handling

| Failure Type | Description | Recovery Action |
|--------------|-------------|-----------------|
| **Recoverable** | Sub-agent made mistake, approach sound | Retry with corrected prompt (max 1) |
| **Approach Failure** | Wrong approach for step | Escalate to user |
| **Foundation Issue** | Previous step output insufficient | Revisit earlier step |

**Critical Rules:**
- NEVER continue past a failed step
- NEVER retry more than once without user input
- STOP and report if context is missing
