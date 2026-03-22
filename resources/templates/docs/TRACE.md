# Reasoning Trace Template

> Track your reasoning process through layered analysis.
> Copy to _reasoning/trace.md when debugging a complex problem.

---

## Problem Statement
<!-- Brief description of the problem -->

## Entry Point
- **Signal**: <!-- error message, user request, failing test -->
- **Entry Layer**: <!-- Domain / Design / Implementation -->

---

## Trace UP (from error → root cause)

### Implementation → Design
- **Question**: What design choice led to this?
- **Finding**: <!-- discovered pattern or design issue -->

### Design → Domain
- **Question**: What domain constraint requires this design?
- **Finding**: <!-- discovered constraint -->

---

## Trace DOWN (from constraint → implementation)

### Domain → Design
- **Constraint**: <!-- domain rule that applies -->
- **Design Implication**: <!-- pattern choice -->

### Design → Implementation
- **Pattern**: <!-- chosen design pattern -->
- **Implementation**: <!-- language mechanism to use -->

---

## Attempts Log

### Attempt 1
- **Approach**: <!-- what was tried -->
- **Result**: <!-- success / failure + details -->
- **Learning**: <!-- what was learned -->

### Attempt 2
- **Approach**: <!-- what was tried -->
- **Result**: <!-- success / failure + details -->
- **Learning**: <!-- what was learned -->

### Attempt 3 (Escalation)
<!-- If 3 attempts fail, escalate: zoom out from implementation to design, or design to domain -->
- **Escalation direction**: <!-- implementation→design or design→domain -->
- **New approach**: <!-- approach after escalation -->
- **Result**: <!-- outcome -->

---

## Error Log

| Error | Message | Analysis | Fix |
|-------|---------|----------|-----|
| <!-- type --> | <!-- message --> | <!-- root cause --> | <!-- resolution --> |

---

## Current Status

- [ ] Problem understood
- [ ] Entry layer identified
- [ ] Trace direction chosen (UP/DOWN)
- [ ] Root cause found
- [ ] Solution designed
- [ ] Solution implemented
- [ ] Solution verified

---

## References

| Source | Key Insight |
|-------|-------------|
| <!-- skill, doc, or reference --> | <!-- what was learned --> |
