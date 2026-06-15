# Task Decomposition

> Detailed guidance for Phase 1: Task Analysis and Decomposition

## Analysis Process

Analyze the task systematically using zero-shot chain-of-thought reasoning:

```text
Let me analyze this task step by step to decompose it into sequential subtasks:

1. Task Understanding
   - What is the overall objective?
   - What is being asked to change?
   - What counts as success?

2. Dependency Mapping
   - Which parts of the system must change first?
   - Which later steps rely on earlier outputs?
   - Where could sequencing mistakes create rework?

3. Boundary Definition
   - What files, services, or modules are in scope?
   - What should stay untouched?
   - Which risks require explicit verification?

4. Step Design
   - Input: What does this step need?
   - Action: What transformation does it make?
   - Output: What should exist after the step?
   - Verification: How do we know it succeeded?
```

## Decomposition Strategies by Pattern

| Pattern | Decomposition Strategy | Example |
|---------|------------------------|---------|
| Interface change | 1. Update interface, 2. Update implementations, 3. Update consumers | "Change return type of getUser" |
| Feature addition | 1. Add core logic, 2. Add integration points, 3. Add API layer | "Add caching to UserService" |
| Refactoring | 1. Extract or modify core, 2. Update internal references, 3. Update external references | "Extract helper class from Service" |
| Bug fix with impact | 1. Fix root cause, 2. Fix dependent issues, 3. Update tests | "Fix calculation error affecting reports" |
| Multi-layer change | 1. Data layer, 2. Business layer, 3. API layer, 4. Client layer | "Add new field to User entity" |

## Output Format

```markdown
## Task Decomposition

### Original Task
{task_description}

### Sequential Steps
1. **Step 1: {name}**
   - Input: {required context}
   - Action: {change to make}
   - Output: {expected artifact}
   - Verification: {how to check}

2. **Step 2: {name}**
   - Input: {depends on step 1}
   - Action: {change to make}
   - Output: {expected artifact}
   - Verification: {how to check}

### Dependency Graph
Step 1 ─→ Step 2 ─→ Step 3 ─→ ...
```

## Decomposition Guidelines

- **Be explicit:** Each subtask should have a clear, verifiable outcome.
- **Define verification points:** State what the judge should check for each step.
- **Minimize steps:** Combine related work; do not over-decompose.
- **Validate dependencies:** Ensure each step has what it needs from previous steps.
- **Plan context:** Identify what context must pass between steps.
