---
name: conductor
description: "Organizes project context, track-based work management, and TDD execution with the Conductor system."
origin: lamella
---

# Conductor

Conductor treats project context as a first-class artifact managed alongside code. It organizes
work into tracks (logical units with specs, plans, and implementation phases) and enforces a
TDD workflow with phase checkpoints.

## When to Use

- Setting up new projects with structured context
- Creating feature/bug/refactor tracks
- Following TDD red-green-refactor task lifecycle
- Managing phase checkpoints and verification
- Maintaining project context artifacts

---

## Context Artifacts

Store in `conductor/` directory at project root.

| Artifact | Purpose | Contents |
|----------|---------|----------|
| `product.md` | WHAT and WHY | Vision, goals, target users, core features |
| `product-guidelines.md` | HOW to communicate | Brand voice, UX principles |
| `tech-stack.md` | WITH WHAT | Languages, frameworks, infrastructure, dependencies |
| `workflow.md` | HOW to work | Dev process, branching strategy, review process |
| `tracks.md` | WHAT'S HAPPENING | Active tracks registry with status |

### Principles
- **Context precedes code** — Define what you're building before implementation
- **Living documentation** — Artifacts evolve with the project
- **Single source of truth** — One canonical location for each type of information
- **Keep synchronized** — Update tech-stack.md when adding deps, product.md when features complete

### Workflow
**Context → Spec & Plan → Implement**

1. Establish/verify context artifacts
2. Define requirements and acceptance criteria (spec.md)
3. Break into phased, actionable tasks (plan.md)
4. Execute tasks following TDD workflow

See [references/artifact-templates.md](references/artifact-templates.md) for templates.

---

## Track Management

A track is a logical work unit with unique ID, specification, plan, and metadata.

### Track Types

| Type | Use For |
|------|---------|
| `feature` | New functionality, integrations |
| `bug` | Defect fixes, security vulnerabilities |
| `chore` | Dependencies, configuration, docs |
| `refactor` | Restructuring, tech debt, performance |

### Track ID Format
`{shortname}_{YYYYMMDD}` — e.g., `user-auth_20250115`

### Track Lifecycle

**1. Creation**
- Gather requirements → generate `spec.md`
- Break into phases → generate `plan.md`
- Register in `tracks.md` → create `metadata.json`

**2. Implementation**
- Select next `[ ]` task → mark `[~]`
- Implement via TDD → mark `[x]` with commit SHA
- Complete phase verification → wait for approval

**3. Completion**
- Verify all acceptance criteria met
- Update product.md/tech-stack.md if needed
- Mark track completed in tracks.md

### Status Markers

| Marker | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[~]` | In Progress |
| `[x]` | Complete (include SHA) |
| `[-]` | Skipped |
| `[!]` | Blocked |

### Track Sizing

| Size | Signs | Action |
|------|-------|--------|
| Right | 1-5 days, 2-4 phases, 8-20 tasks | Good |
| Too Large | >5 phases, >25 tasks, >1 week | Split |
| Too Small | 1 phase, 1-2 tasks, <few hours | Combine |

See [references/track-templates.md](references/track-templates.md) and
[references/track-operations.md](references/track-operations.md) for details.

---

## TDD Task Lifecycle

For each task in a track:

1. **Select** next pending `[ ]` task
2. **Mark** as in-progress `[~]`
3. **RED** — Write failing tests
4. **GREEN** — Implement minimum code to pass
5. **REFACTOR** — Improve clarity (keep tests green)
6. **Verify** coverage >= 80%
7. **Commit** with proper message
8. **Update** plan.md: `[x] Task \`abc1234\``

### Phase Completion Protocol

When all phase tasks complete:
1. Identify changed files: `git diff --name-only <checkpoint>..HEAD`
2. Ensure test coverage for all modified files
3. Run full test suite
4. Generate verification checklist
5. **WAIT** for user approval
6. Create checkpoint commit

### Quality Gates

| Gate | Requirement |
|------|-------------|
| Tests | All pass, no regressions |
| Coverage | >= 80% on new code |
| Style | Linting passes |
| Docs | Public APIs documented |
| Types | Type checker passes |
| Security | No secrets, inputs validated |

See [references/tdd-lifecycle.md](references/tdd-lifecycle.md) and
[references/verification-protocol.md](references/verification-protocol.md).

---

## References

- [references/artifact-templates.md](references/artifact-templates.md) — Context artifact templates
- [references/track-templates.md](references/track-templates.md) — spec.md, plan.md, tracks.md structures
- [references/track-operations.md](references/track-operations.md) — Creating, completing, reverting tracks
- [references/track-quality-checklists.md](references/track-quality-checklists.md) — Spec and plan verification
- [references/tdd-lifecycle.md](references/tdd-lifecycle.md) — Full 11-step TDD process
- [references/git-integration.md](references/git-integration.md) — Commit formats, git notes
- [references/verification-protocol.md](references/verification-protocol.md) — Phase completion, QA gates
- [references/error-recovery.md](references/error-recovery.md) — Handling deviations, blockers
