# Subagent Consolidation Review

Records the current keep, merge, and defer decisions for overlapping shared
subagents after the first migration waves.

Related:

- `docs/authoring/shared-subagent-model.md`
- `docs/authoring/subagent-migration-audit.md`
- `resources/subagents/`

## Current Decisions

| Area | Decision | Reason |
|------|----------|--------|
| `docs-writer` vs `tech-writer` | `Keep separate` | `docs-writer` is code-aligned drift repair and implementation-oriented docs work; `tech-writer` is broader audience-oriented documentation authoring. |
| `framework-researcher` vs `researcher` | `Keep separate` | `framework-researcher` is official-guidance and framework-specific; `researcher` is broader option-comparison and recommendation work. |
| `source-researcher` vs `researcher` | `Defer` | The boundary is still fuzzy; both are research-oriented and may collapse later if usage does not justify both. |
| `database-architect` vs adjacent architecture/data specialists | `Defer` | The shared model only covers one database-focused worker so far; there is not enough migrated overlap yet to merge safely. |
| `security-reviewer` vs narrower audit workers | `Keep separate` | `security-reviewer` is the broad application-security reviewer; the narrower workers are verification or specialized audit lanes. |
| `api-documenter` vs broader documentation writers | `Keep separate` | API contract and reference work still has a materially different workflow from general docs authoring. |
| `tutorial-engineer` vs `tech-writer` | `Keep separate` | Tutorial-first pedagogy and audience documentation are different enough to keep distinct. |
| `content-writer` vs other writing specialists | `Defer` | The writing surface is still broad and lightly consolidated; wait for more migrated evidence. |
| `bug-auditor` vs `bug-hunter` | `Keep separate` | `bug-auditor` is a broad static runtime defect sweep; `bug-hunter` is diff-focused proactive review. |
| `bug-reproduction-validator` vs `debugger` | `Keep separate` | One verifies a report; the other diagnoses and fixes a confirmed failure. |
| `deploy-checker` vs `deployment-engineer` | `Keep separate` | Readiness review and delivery implementation are separate jobs. |
| `semgrep-scanner` vs higher-level security scanning workflows | `Keep separate` | `semgrep-scanner` is a worker primitive for running scans, not a top-level security reviewer. |
| `qa-engineer` vs `test-runner` | `Keep separate` | `qa-engineer` writes verification gates into task specs; `test-runner` executes verification commands. |
| `browser-tester` vs `e2e-runner` | `Keep separate` | Manual-style live-browser validation and durable automated end-to-end coverage remain meaningfully different. |
| `fullstack-qa-orchestrator` vs `browser-tester` and `e2e-runner` | `Defer` | This may eventually become a workflow rather than a subagent, but the current orchestration role is still distinct enough to keep. |
| `team-implementer` vs `implementer` | `Keep separate` | `team-implementer` assumes coordinator-managed ownership boundaries; `implementer` is a solo mechanical executor. |
| `team-debugger` vs `debugger` | `Keep separate` | `team-debugger` investigates one assigned hypothesis; `debugger` owns the full reactive debugging loop. |
| `team-reviewer` vs domain reviewers | `Keep separate` | `team-reviewer` is a lane-specific review primitive for coordinated parallel review, not a replacement for domain-specific solo reviewers. |
| `team-lead` vs `planner` | `Keep separate` | `planner` structures work; `team-lead` actively coordinates multi-worker execution. |
| `socratic-mentor` vs direct tutoring or implementation help | `Keep separate` | The discovery-learning interaction pattern is intentionally different from direct instruction or coding help. |

## Renames

Current rename decisions:

| Old Name | Current Name | Status |
|----------|--------------|--------|
| `dep-auditor` | `dependency-auditor` | Adopted |

No additional renames are recommended right now. Most migrated names are
already specific, composable, and aligned with the current shared taxonomy.

## Likely Future Consolidation Targets

These are the best merge or re-home candidates once more usage data exists:

- `source-researcher` into `researcher`
- `fullstack-qa-orchestrator` into a workflow or command wrapper
- parts of the collaboration `team-*` set into a smaller orchestration core if the distinctions are not used in practice
- broad writing/content overlap once more of the content specialists migrate

## Review Rule

Do not rename or merge a shared subagent unless at least one of these is true:

- the current name is ambiguous enough to cause repeated routing mistakes
- two subagents have materially overlapping triggers and near-identical workflows
- the only difference is product-era packaging, not behavior
- usage shows one worker is effectively never the right choice
