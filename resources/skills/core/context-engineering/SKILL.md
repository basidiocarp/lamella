---
name: context-engineering
description: "Activate when designing or optimizing context windows in agent systems — explains components, mechanics, constraints, and assembly patterns."
requires:
  - hyphae
origin: lamella
---

# Context Engineering Fundamentals

Context is the complete state available to a language model at inference time. It includes everything the model can attend to when generating responses: system instructions, tool definitions, retrieved documents, message history, and tool outputs.

## Table of Contents

### Core Topics
- [Context Fundamentals](references/context-fundamentals.md) - Anatomy of context, attention mechanics, quality vs quantity
- [Degradation Patterns](references/degradation-patterns.md) - Lost-in-middle, poisoning, distraction, confusion, clash
- [Optimization Techniques](references/optimization-techniques.md) - Compaction, observation masking, partitioning

### Multi-Agent Verification Workflows
- [Hallucination Detection](references/hallucination-detection.md) - Detect and prevent factual errors
- [Lost-in-Middle Detection](references/lost-in-middle-detection.md) - Find ignored instructions
- [Error Propagation Analysis](references/error-propagation.md) - Trace errors through agent chains
- [Relevance Scoring](references/relevance-scoring.md) - Identify distractor content
- [Health Monitoring](references/health-monitoring.md) - Monitor long-running sessions

---

## Core Concepts

**Context Components:**
- **System prompts** - Core identity, constraints, behavioral guidelines
- **Tool definitions** - Available actions with names, descriptions, parameters
- **Retrieved documents** - Domain knowledge loaded at runtime
- **Message history** - Conversation state and reasoning scratchpad
- **Tool outputs** - Results of agent actions (can reach 83.9% of context)

**Key Principles:**
- Context is a finite resource with diminishing marginal returns
- Quality matters more than quantity (informativity over exhaustiveness)
- Progressive disclosure: load information only as needed
- The attention budget depletes as context grows

---

## Degradation Patterns Quick Reference

| Pattern | Symptom | Primary Mitigation |
|---------|---------|-------------------|
| Lost-in-Middle | Middle instructions ignored | Place critical info at edges |
| Context Poisoning | Errors compound repeatedly | Truncate or restart with clean context |
| Context Distraction | Unfocused responses | Curate what enters context |
| Context Confusion | Wrong task requirements applied | Segment tasks with clear transitions |
| Context Clash | Contradictory guidance | Priority rules, version filtering |

**Degradation Warning Signs:**
- **50-70%**: Agent occasionally misses instructions
- **70-85%**: Inconsistent behavior, "forgets" earlier instructions
- **>85%**: Ignores constraints, hallucinations increase

---

## The Four-Bucket Approach

| Strategy | Purpose | When to Apply |
|----------|---------|---------------|
| **Write** | Save context outside window | Preserve info without context cost |
| **Select** | Pull relevant context only | Exclude irrelevant information |
| **Compress** | Reduce tokens, preserve signal | Extend effective capacity |
| **Isolate** | Split across sub-agents | Prevent single context from growing large |

---

## Prompt Structure Template

```markdown
<CRITICAL_CONSTRAINTS>                    # At start (high attention)
- Never modify production files directly
- Always run tests before committing
</CRITICAL_CONSTRAINTS>

<DETAILED_GUIDELINES>                     # Middle (lower attention)
- Code style preferences
- Documentation templates
</DETAILED_GUIDELINES>

<KEY_REMINDERS>                           # At end (high attention)
- Run tests: npm test
- Create PR with description
</KEY_REMINDERS>
```

---

## Optimization Quick Reference

### What to Optimize

| Context Dominated By | Apply |
|---------------------|-------|
| Tool outputs | Observation masking |
| Retrieved documents | Summarization or partitioning |
| Message history | Compaction with summarization |
| Multiple components | Combine strategies |

### Command/Skill Design

```markdown
# Good: Focused command with clear scope
---
name: review-security
description: Review code for security vulnerabilities
---

# Good: Concise skill description
description: Analyze code architecture. Use for design reviews.

# Bad: Verbose description
description: This skill provides comprehensive analysis of code
architecture including but not limited to class hierarchies,
dependency graphs, coupling metrics, cohesion analysis...
```

### Sub-Agent Context Design

```markdown
# Good: Minimal handoff
"Review authentication module for security issues.
Return findings in structured format."

# Bad: Verbose handoff
"I need you to look at the authentication module which is
located in src/auth/ and contains several files including
login.ts, session.ts, tokens.ts... [500 more tokens of context]"
```

---

## Multi-Agent Verification Summary

### Hallucination Detection
1. Generate output normally
2. Extract factual claims
3. Verify claims with tools
4. Calculate poisoning risk: `(false_count * 2 + unverifiable_count) / total_claims`
5. Regenerate if risk > 0.3

### Lost-in-Middle Detection
1. Identify critical instructions
2. Run 3-5 agents with same prompt
3. Verify compliance for each instruction
4. Calculate compliance rate
5. Move at-risk instructions (<80%) to edges

### Context Health Monitoring
Every 10 turns, check for:
- Lost-in-middle symptoms (missing early instructions)
- Poisoning (repeating errors, persistent hallucinations)
- Distraction (unfocused responses)
- Confusion (mixing task requirements)
- Clash (uncertainty about conflicting info)

**Actions:** CONTINUE | COMPACT | RESTART

---

## Guidelines

### Context Management
1. Treat context as a finite resource with diminishing returns
2. Place critical information at attention-favored positions (beginning and end)
3. Use progressive disclosure to defer loading until needed
4. Monitor context usage during development
5. Implement compaction triggers at 70-80% utilization

### Prompt Design
6. Organize system prompts with clear section boundaries
7. Design for context degradation rather than hoping to avoid it
8. Prefer smaller high-signal context over larger low-signal context
9. Segment tasks to prevent confusion across different objectives

### Optimization
10. Measure before optimizing—know your current state
11. Apply compaction before masking when possible
12. Partition before context becomes problematic
13. Balance token savings against quality preservation

### Multi-Agent Verification
14. Spawn verification agents with focused, single-purpose prompts
15. Set clear thresholds for action vs. continue decisions
16. Implement verification at natural checkpoints, not every turn
17. Design verification to be skippable in time-critical scenarios
