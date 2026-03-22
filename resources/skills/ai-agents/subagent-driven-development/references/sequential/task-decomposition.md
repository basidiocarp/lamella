# Task Decomposition

> Detailed guidance for Phase 1: Task Analysis and Decomposition

## Analysis Process

Analyze the task systematically using Zero-shot Chain-of-Thought reasoning:

```
Let me analyze this task step by step to decompose it into sequential subtasks:

1. **Task Understanding**
   "What is the overall objective?"
   - What is being asked?
// ... (22 lines trimmed)
   - Action: What transformation/change does it make?
   - Output: What does this step produce?
   - Verification: How do we know it succeeded?
```

## Decomposition Strategies by Pattern

| Pattern | Decomposition Strategy | Example |
|---------|------------------------|---------|
| Interface change | 1. Update interface, 2. Update implementations, 3. Update consumers | "Change return type of getUser" |
| Feature addition | 1. Add core logic, 2. Add integration points, 3. Add API layer | "Add caching to UserService" |
| Refactoring | 1. Extract/modify core, 2. Update internal references, 3. Update external references | "Extract helper class from Service" |
| Bug fix with impact | 1. Fix root cause, 2. Fix dependent issues, 3. Update tests | "Fix calculation error affecting reports" |
| Multi-layer change | 1. Data layer, 2. Business layer, 3. API layer, 4. Client layer | "Add new field to User entity" |

## Output Format

```markdown
## Task Decomposition

### Original Task
{task_description}

// ... (8 lines trimmed)

### Dependency Graph
Step 1 ─→ Step 2 ─→ Step 3 ─→ ...
```

## Decomposition Guidelines

- **Be explicit:** Each subtask should have a clear, verifiable outcome
- **Define verification points:** What should the judge check for each step?
- **Minimize steps:** Combine related work; don't over-decompose
- **Validate dependencies:** Ensure each step has what it needs from previous steps
- **Plan context:** Identify what context needs to pass between steps
