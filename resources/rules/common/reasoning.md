# Reasoning

## Layered Thinking: WHY / WHAT / HOW

Before jumping to implementation, trace through three levels:

```
Level 3: Requirements (WHY)
  Domain rules, business constraints, regulatory needs
  "Why does it need to work this way?"

Level 2: Design (WHAT)
  Patterns, architecture, abstractions, trade-offs
  "What approach fits these constraints?"

Level 1: Implementation (HOW)
  Language features, framework APIs, specific code
  "How do I build this?"
```

### Trace Direction

Start from the user's question and trace in the right direction:

| Signal | Start At | Direction |
|--------|----------|-----------|
| Error, stack trace, "it broke" | Implementation | Trace UP — what design led to this? |
| "How should I design..." | Design | Check requirements, then trace DOWN |
| "Building a [domain] system" | Requirements | Trace DOWN through design to code |
| "Best practice for..." | Design | Both directions |
| Performance problem | Implementation, then Design | UP then DOWN |

### Anti-Patterns

- Answering at the implementation level without checking design context. "Use library X" isn't an answer if the architecture is wrong.
- Skipping to code when the requirements aren't understood. Writing the wrong thing correctly is still wrong.
- Ignoring domain constraints. "Share data between threads with a mutex" ignores whether the domain even needs shared mutable state.

### Externalized Cognition

For complex problems (multi-file refactors, architecture decisions, deep debugging), create a `_reasoning/` directory:

- `trace.md` — reasoning process, attempts log, error log
- `findings.md` — discovered constraints, patterns considered, trade-offs
- `decision.md` — what was decided, rationale per level, alternatives rejected

Update these files every 2 key operations. Context windows are volatile; the filesystem is not.

Templates are in the `templates/` directory: `reasoning-trace.md`, `reasoning-findings.md`, `reasoning-decision.md`.
