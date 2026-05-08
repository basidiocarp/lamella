---
name: plan-fleet
description: "Run this when breaking down work for fleet execution — creates implementation plans optimized for GitHub Copilot CLI parallel agents."
origin: lamella
references:
  - references/examples.md
  - references/patterns.md
---

# Fleet Plan Generator

Create implementation plans where each task is self-contained and executable by an independent Copilot CLI agent. Plans include model assignments, acceptance criteria checkboxes, and verification requirements.

## When to Use

- Before delegating implementation to Copilot CLI `/delegate` or `/fleet`
- Multi-file features, refactors, or migrations
- Any task with 3+ independent subtasks

## Workflow

1. **Discover models** — Check available models via `claude model list` or `/models`
2. **Analyze** the request and codebase
3. **Decompose** into independent, parallelizable tasks
4. **Assign models** — Match task complexity to appropriate model
5. **Write** the plan to `.plans/<name>.md`
6. **User executes** in Copilot CLI:
   - Single task: `/delegate Implement task 1 from .plans/<name>.md`
   - All parallel: `/fleet Implement the plan in .plans/<name>.md`

## Model Selection

Match task complexity to model capability:

| Task Type | Recommended Model |
|-----------|-------------------|
| Simple refactors, renames, formatting | `claude-haiku-4.5`, `gpt-5-mini` |
| Standard implementation, tests, CRUD | `claude-sonnet-4.6`, `gpt-5.2` |
| Architecture, algorithms, security | `claude-opus-4.6`, `gpt-5.4` |
| Code review, validation | `claude-sonnet-4.6`, `claude-opus-4.6` |

Always specify model for critical decisions (use Opus) or mechanical work (use Haiku to save cost).

## Plan Format

```markdown
# Plan: <title>

## Metadata
- **Created:** <date>
- **Default Model:** <e.g. claude-sonnet-4.6>
- **Estimated Tasks:** <count>

## Context
<2-3 sentences: what this plan achieves and why>

## Phases

### Phase 1: <name>

### Task 1.1: <title>
**Model:** <model or "default">
**Files:**
- `path/to/file.rs` (create|modify|delete)

**Context:**
<What the agent needs to know>

**Accept Criteria:**
- [ ] AC1: <verifiable outcome>
- [ ] AC2: <another verifiable outcome>

**Implementation Notes:**
<Decisions already made, patterns to follow>

**Verification (agent must run before completing):**
```bash
<commands to verify work>
```

---

### Phase 2: <name>
...

## Final Verification
```bash
<commands to verify the full plan>
```

## Completion Checklist
- [ ] All Phase 1 tasks complete
- [ ] All Phase 2 tasks complete
- [ ] Final verification passes
```

## Requirements

**Acceptance Criteria:** Every task must have verifiable criteria as checkboxes. Criteria must be specific and actionable.

- Good: "- [ ] `cargo test user::tests` passes (4 new tests)"
- Bad: "- [ ] Tests pass"

**Context:** Each task must include enough detail for a fresh agent to execute independently. Never assume shared context across tasks or phases.

**Verification:** Include bash commands the agent runs to self-validate before completing.

**Parallelization:** Tasks in the same phase cannot modify the same files. If two tasks touch the same file, put them in different phases.

**Task sizing:** Keep tasks to 1 PR-worthy chunk. Too small (single variable rename), combine with related work. Too large (rewrite entire subsystem), split further.

## Examples and Patterns

For a complete worked example, see `references/examples.md`.

For task sizing, parallelization, and design patterns, see `references/patterns.md`.

## Output Location

Always save plans to `.plans/` in the project root:

```
.plans/
  <descriptive-name>.md
```

Create the directory if it doesn't exist. Use kebab-case for filenames.
