# Model Selection (Phase 3)

Select the optimal model based on task analysis. **Same configuration for all parallel agents** ensures consistent quality.

## Model Selection Table

| Task Profile | Recommended Model | Rationale |
|--------------|-------------------|-----------|
| **Complex per-target** (architecture, design) | `opus` | Maximum reasoning capability per task |
| **Specialized domain** (code review, security) | `opus` | Domain expertise matters |
| **Medium complexity, large output** | `sonnet` | Good capability, cost-efficient for volume |
| **Simple transformations** (rename, format) | `haiku` | Fast, cheap, sufficient for mechanical tasks |
| **Default** (when uncertain) | `opus` | Optimize for quality over cost |

## Decision Tree

```
Is EACH target's task COMPLEX (architecture, novel problem, critical decision)?
|
+-- YES --> Use Opus for ALL agents
|
+-- NO --> Is task SIMPLE and MECHANICAL (rename, format, extract)?
           |
           +-- YES --> Use Haiku for ALL agents
           |
           +-- NO --> Is output LARGE but task not complex?
                      |
                      +-- YES --> Use Sonnet for ALL agents
                      |
                      +-- NO --> Use Opus for ALL agents (default)
```

## Specialized Agent Selection (Optional)

If the task matches a specialized domain, include the relevant agent prompt in ALL parallel agents.

**Use specialized agent when:**
- Task clearly benefits from domain expertise
- Consistency across all parallel agents is important
- Task is NOT trivial (overhead not justified for simple tasks)

**Skip specialized agent when:**
- Task is simple/mechanical (Haiku-tier)
- No clear domain match exists
- General-purpose execution is sufficient

## Examples by Scenario

| Scenario | Model | Reason |
|----------|-------|--------|
| Security analysis | Opus | Critical reasoning required |
| Architecture decisions | Opus | Quality over speed |
| Simple refactoring | Haiku | Fast, sufficient |
| Documentation generation | Haiku | Mechanical task |
| Code review per file | Sonnet | Balanced capability |
| Test generation | Sonnet | Extensive but patterned |
