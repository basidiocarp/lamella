# Verification Specifications Reference

This appendix documents how task files specify verification requirements.

## Required Elements

1. **Level**
   - `None`
   - `Single Judge`
   - `Panel of 2 Judges`
   - `Per-Item Judges`
2. **Artifact(s)**
3. **Threshold**
4. **Rubric**
5. **Reference Pattern** (optional)

## Rubric Format

```markdown
| Criterion | Weight | Description |
|-----------|--------|-------------|
| Type Correctness | 0.35 | Types match specification exactly |
| API Contract Alignment | 0.25 | Aligns with documented contract |
| Code Quality | 0.20 | Follows project conventions |
| Test Coverage | 0.20 | Tests cover required behavior |
```

Rules:
- weights must sum to `1.0`
- criteria must be measurable
- most rubrics should stay in the 3-6 criterion range

## Example Verification Section

```markdown
#### Verification

**Level:** Panel of 2 Judges
**Artifact:** `src/decision/decision.service.ts`, `src/decision/tests/decision.service.spec.ts`
**Threshold:** 4.0/5.0

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Type Correctness | 0.30 | Types match the specification |
| Contract Alignment | 0.25 | Behavior matches the plan |
| Code Quality | 0.25 | Conventions and structure are sound |
| Test Coverage | 0.20 | Tests cover approval, rejection, and routing |

**Reference Pattern:** NestJS service patterns
```

## Execution Use

During execution:
1. extract verification data from the task file
2. launch the required judge setup
3. aggregate results
4. compare the score to the threshold
5. retry or fix if verification fails
