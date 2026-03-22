# ISSUES.md Template

This file is auto-created when Rule 5 (Log non-critical enhancements) is first triggered during execution.

Location: `.planning/ISSUES.md`

```markdown
# Project Issues Log

Non-critical enhancements discovered during execution. Address in future phases when appropriate.

## Open Enhancements
// ... (33 lines trimmed)

**Summary:** [X] open, [Y] closed
**Priority queue:** [List ISS numbers in priority order, or "Address as time permits"]
```

## Usage Guidelines

**When issues are added:**
- Auto-increment ISS numbers (ISS-001, ISS-002, etc.)
- Always include discovery context (Phase/Plan/Task and date)
- Be specific about impact and effort
- Suggested phase helps with roadmap planning

**When issues are resolved:**
- Move to "Closed Enhancements" section
- Document resolution and benefit
- Keeps history for reference

**Prioritization:**
- Quick wins (Quick effort, visible benefit) → Earlier phases
- Substantial refactors (Substantial effort, organizational benefit) → Dedicated "code health" phases
- Nice-to-haves (Low impact, high effort) → "Future" or never

**Integration with roadmap:**
- When planning new phases, scan ISSUES.md for relevant items
- Can create phases specifically for addressing accumulated issues
- Example: "Phase 8: Code Health - Address ISS-003, ISS-007, ISS-012"

## Example: Issues Driving Phase Planning

```markdown
# Roadmap excerpt

### Phase 6: Performance Optimization (Planned)

**Milestone Goal:** Address performance issues discovered during v1.0 usage

**Includes:**
- ISS-002: Redis connection pooling (Medium effort)
- ISS-015: Database query optimization (Quick)
- ISS-021: Image lazy loading (Medium)

**Excludes ISS-003 (refactoring):** Saving for dedicated code health phase
```

This creates traceability: enhancement discovered → logged → planned → addressed → documented.
