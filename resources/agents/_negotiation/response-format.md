# Negotiation Response Format

> Standard response structure for agents in negotiation mode.

## When to Use

This format is REQUIRED when the orchestrator dispatches with `negotiation: true`.

For standard (non-negotiation) queries, use the agent's default output format.

---

## Response Structure

```markdown
## Negotiation Response

### Findings
[Primary query results]
### Confidence
- **Level**: [HIGH | MEDIUM | LOW | UNCERTAIN]
- **Reason**: [Why this confidence level fits the available evidence]

### Gaps Identified
- [ ] [Unverified fact or missing source]
- [ ] [Open question that affects answer quality]

### Context Needed
- [Question for orchestrator, if additional context is needed]

### Metadata
- **Source**: [Data source]
- **Coverage**: [Coverage assessment]
```

---

## Section Requirements

### Findings (Required)

What the agent discovered. This is the core content.

**Guidelines:**
- Include all relevant data found
- Structure clearly (use sub-headers if complex)
- Don't omit data just because it seems obvious
- Include raw data, let orchestrator synthesize

**Example:**
```markdown
### Findings
**Crate:** tokio
**Version:** 1.49.0
**Description:** An event-driven, non-blocking I/O platform

**Key Features:**
- `full`: Enables all features
- `rt-multi-thread`: Multi-threaded runtime
- `sync`: Synchronization primitives

**Recent Changes:**
- 1.49.0: Added cooperative scheduling improvements
```

### Confidence (Required)

Self-assessment of finding reliability.

| Level | Meaning | Criteria |
|-------|---------|----------|
| HIGH | Reliable, complete | Primary source, core data complete |
| MEDIUM | Partial, usable | Some source, core data found |
| LOW | Limited, gaps | Minimal sources, incomplete |
| UNCERTAIN | Unreliable | No sources, errors, conflicts |

**Example:**
```markdown
### Confidence
- **Level**: MEDIUM
- **Reason**: Found crate info on lib.rs, but changelog not accessible
```

### Gaps Identified (Required)

What couldn't be found or verified.

**Guidelines:**
- Be specific about what's missing
- Use checkboxes to allow marking as resolved
- Prioritize by impact on answer quality
- Don't list irrelevant gaps

**Example:**
```markdown
### Gaps Identified
- [ ] Performance benchmarks not found
- [ ] Breaking changes from 1.48 unknown
- [x] Feature list - resolved from docs.rs
```

### Context Needed (Conditional)

Questions for the orchestrator to enable better answers.

**When to include:**
- Query is ambiguous
- Multiple valid interpretations
- Need domain-specific context
- Scope unclear

**When to skip:**
- Query is unambiguous
- All necessary context provided
- Direct lookup with clear answer

**Example:**
```markdown
### Context Needed
- Q1: Is this for a web server or CLI application?
- Q2: Do you need WebSocket support?
```

**Not needed for:**
```markdown
Query: "What is tokio's latest version?"
→ No context needed, direct lookup
```

### Metadata (Required)

Source attribution and coverage assessment.

**Example:**
```markdown
### Metadata
- **Source**: lib.rs/crates/tokio, docs.rs/tokio/1.49.0
- **Coverage**: 85% - missing performance benchmarks
```

---

## Coverage Assessment Guide

| Coverage | Meaning |
|----------|---------|
| 100% | All requested data found |
| 80-99% | Minor gaps, core complete |
| 50-79% | Significant gaps, partial answer |
| <50% | Major gaps, may need alternative |

---

## Response Examples

### High Confidence Example

```markdown
## Negotiation Response

### Findings
**Crate:** serde
**Version:** 1.0.219
**Description:** Serialization framework for Rust data structures

**Key Features:**
- Derive-based serialization and deserialization
- Broad ecosystem support for JSON, YAML, and other formats
- Strong compatibility with typed Rust APIs

### Confidence
- **Level**: HIGH
- **Reason**: Primary sources covered the crate metadata and current usage guidance.

### Gaps Identified
- [ ] Benchmarks against alternative serialization crates

### Context Needed
- None

### Metadata
- **Source**: lib.rs, docs.rs/serde/1.0.219
- **Coverage**: 95% - comprehensive for typical use
```

### Low Confidence Example

```markdown
## Negotiation Response

### Findings
**Crate:** obscure-crate
**Version:** 0.1.2 (last updated 2023)
**Description:** Minimal registry metadata found, but no maintained documentation surfaced.

**Observed Signals:**
- Low update frequency
- Sparse ecosystem references
- Production readiness is unclear

### Confidence
- **Level**: LOW
- **Reason**: Only partial metadata was available and supporting documentation was weak.

### Gaps Identified
- [ ] Maintainer activity and release cadence
- [ ] Feature documentation
- [ ] Security or compatibility notes

### Context Needed
- Q1: Is this crate mandatory for compatibility, or are alternatives acceptable?

### Metadata
- **Source**: crates.io (lib.rs had no additional info)
- **Coverage**: 30% - minimal data available
```

### Comparative Query Example

```markdown
## Negotiation Response

### Findings
**Comparison:** tokio vs async-std (runtime focus)

**tokio**
- Larger ecosystem and broader production adoption
- Strong tooling around tracing, networking, and task orchestration

**async-std**
- Simpler standard-library-like API shape
- Smaller ecosystem and fewer production-oriented integrations

**Tradeoff Summary**
- Choose `tokio` for ecosystem depth, operations tooling, and production scale
- Choose `async-std` when API simplicity matters more than ecosystem breadth

### Confidence
- **Level**: MEDIUM
- **Reason**: Runtime characteristics are well known, but workload-specific benchmarks depend on context.

### Gaps Identified
- [ ] Latency benchmarks for the target workload
- [ ] Team constraints around existing runtime integrations

### Context Needed
- Q1: Is the target workload server-side, CLI, or embedded?
- Q2: Do you need integrations that already assume Tokio?

### Metadata
- **Source**: lib.rs for both, official docs
- **Coverage**: 60% - characteristics known, specifics missing
```

---

## Anti-Patterns

### Don't: Inflate Confidence

```markdown
# BAD
Confidence: HIGH
Reason: Found some info
# GOOD
Confidence: MEDIUM
Reason: Found basic info, but detailed docs not accessible
```

### Don't: Vague Gaps

```markdown
# BAD
Gaps: Some things missing
# GOOD
Gaps:
- [ ] Feature `x` documentation not found
- [ ] Version 2.0 migration guide unavailable
```

### Don't: Irrelevant Context Questions

```markdown
# BAD (for query "what is tokio version")
Context Needed: What's your favorite color?
# GOOD
Context Needed: (None - query is specific)
```

### Don't: Skip Metadata

```markdown
# BAD
(no metadata section)
# GOOD
Metadata:
- Source: lib.rs
- Coverage: 90%
```

---

## Related Documents

- `_meta/negotiation-protocol.md` - Full protocol specification
- `_meta/negotiation-templates.md` - Agent-specific templates
- `confidence-rubric.md` - Detailed confidence criteria
