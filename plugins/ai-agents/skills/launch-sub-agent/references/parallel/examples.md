# Parallel Executor Examples

Complete execution examples for common scenarios.

## Example 1: Code Simplification

**Input:**
```text
/do-in-parallel "Simplify error handling to use early returns" \
  --files "src/services/user.ts,src/services/order.ts,src/services/payment.ts"
```

**Analysis:**
- Task type: code transformation
- Per-target complexity: medium
- Independence: yes

**Model Selection:** Sonnet

**Result:**
```markdown
## Parallel Execution Summary

### Configuration
- Task: Simplify error handling to use early returns
- Model: Sonnet
- Targets: 3 files

### Results
- src/services/user.ts: PASS
- src/services/order.ts: PASS
- src/services/payment.ts: PASS

### Rollup
- Completed: 3/3
- Common patterns: all files converged on the same early-return style
```

---

## Example 2: Documentation Generation

**Input:**
```text
/do-in-parallel "Generate JSDoc documentation for all public methods" \
  --files "src/api/users.ts,src/api/products.ts,src/api/orders.ts,src/api/auth.ts"
```

**Analysis:**
- Task type: documentation generation
- Complexity: low
- Independence: yes

**Model Selection:** Haiku

---

## Example 3: Security Analysis

**Input:**
```text
/do-in-parallel "Analyze for SQL injection vulnerabilities and suggest fixes" \
  --files "src/db/queries.ts,src/db/migrations.ts,src/api/search.ts"
```

**Analysis:**
- Task type: security analysis
- Complexity: high
- Independence: yes

**Model Selection:** Opus

---

## Example 4: Test Generation

**Input:**
```text
/do-in-parallel "Generate unit tests achieving 80% coverage" \
  --targets "UserService,OrderService,PaymentService,NotificationService"
```

**Analysis:**
- Task type: test generation
- Complexity: medium
- Output size: large
- Independence: yes

**Model Selection:** Sonnet

---

## Example 5: Inferred Targets

**Input:**
```text
/do-in-parallel "Apply consistent logging format to src/handlers/user.ts, src/handlers/order.ts, and src/handlers/product.ts"
```

**Analysis:**
- Targets inferred from task text
- Complexity: low
- Independence: yes

**Model Selection:** Haiku

---

## Error Handling

| Failure Type | Description | Recovery Action |
|--------------|-------------|-----------------|
| Recoverable | Sub-agent made a mistake, approach still sound | Retry once with a corrected prompt |
| Approach failure | Wrong approach for the task | Escalate to the user |
| Foundation issue | Previous step output is insufficient | Revisit earlier step |

**Critical Rules:**
- Never continue past a failed required step.
- Never retry more than once without user input.
- Stop and report if critical context is missing.
