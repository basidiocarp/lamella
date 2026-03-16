# Model Selection

> Detailed guidance for Phase 2: Model Selection for Each Subtask

## Analysis Framework

For each subtask, analyze and select the optimal model:

```
Let me determine the optimal configuration for each subtask:

For Subtask N:
1. **Complexity Assessment**
   "How complex is the reasoning required?"
// ... (19 lines trimmed)
   - Architecture: system design, pattern selection
   - Documentation: API docs, comments, README updates
   - Testing: test generation, test updates
```

## Model Selection Matrix

| Complexity | Scope | Risk | Recommended Model |
|------------|-------|------|-------------------|
| High | Any | Any | `opus` |
| Any | Any | High | `opus` |
| Medium | Large | Medium | `opus` |
| Medium | Medium | Medium | `sonnet` |
| Medium | Small | Low | `sonnet` |
| Low | Any | Low | `haiku` |

## Decision Tree

```
Is this subtask CRITICAL (architecture, interface, breaking changes)?
|
+-- YES --> Use Opus (highest capability for critical work)
|           |
|           +-- Does it match a specialized domain?
// ... (13 lines trimmed)
                                 +-- YES --> Use Haiku (fast, cheap)
                                 |
                                 +-- NO --> Use Sonnet (default for uncertain)
```

## Specialized Agents

Specialized agent list depends on project and plugins loaded. Common agents from `sdd` plugin:
- `sdd:developer`
- `sdd:tdd-developer`
- `sdd:researcher`
- `sdd:software-architect`
- `sdd:tech-lead`
- `sdd:team-lead`
- `sdd:qa-engineer`

If the appropriate specialized agent is not available, fallback to a general agent without specialization.

**Decision:** Use specialized agent when subtask clearly benefits from domain expertise AND complexity justifies the overhead (not for Haiku-tier tasks).

## Output Format

```markdown
## Model/Agent Selection

| Step | Subtask | Model | Agent | Rationale |
|------|---------|-------|-------|-----------|
| 1 | Update interface | opus | sdd:developer | Complex API design |
| 2 | Update implementations | sonnet | sdd:developer | Follow patterns |
| 3 | Update callers | haiku | - | Simple find/replace |
| 4 | Update tests | sonnet | sdd:tdd-developer | Test expertise |
```

## Model Selection Best Practices

- **Match complexity:** Don't use Opus for simple transformations
- **Upgrade for risk:** First step and critical steps deserve stronger models
- **Consider chain effect:** Errors in early steps cascade; invest in quality early
- **When in doubt, use Opus:** Quality over cost for dependent steps
- **Judges can use Sonnet:** Verification is less complex than implementation

### Implementation vs Judge Model Selection

| Step Type | Implementation Model | Judge Model |
|-----------|---------------------|-------------|
| Critical/Breaking | Opus | Opus |
| Standard | Opus | Opus |
| Long and Simple | Sonnet | Sonnet |
| Simple and Short | Haiku | Haiku |
