# SDD Ecosystem Integration Plan

## Overview

Port the Specification-Driven Development (SDD) methodology from Claude Code into the basidiocarp ecosystem by integrating with Hyphae (persistent memory), Rhizome (code intelligence), and Cortina (guardrails/hooks). This enables specs to be authored, tracked, maintained, and recalled across agent sessions with full context and dependency tracking.

## Phase 1: Hyphae Storage

Establish persistent spec storage with hierarchical organization and specialized memory schemas.

**Topic hierarchy**:
```
specs/{project}/{spec-id}
specs/{project}/{spec-id}/tasks
specs/{project}/{spec-id}/journal
```

**Memory schemas**:
- Spec metadata: spec-id, title, status (draft/active/archived), created, updated
- Task storage: task-id, spec-id, status (open/done/blocked), depends_on[], estimate
- Journal entries: timestamp, event (created/updated/task_added/spec_evolved), summary, actor

**Memoir creation**:
- Auto-generate dependency graph via `rhizome export` (which specs depend on which files)
- Store as permanent memoir: `specs/{project}/{spec-id}/dependencies`
- Link specs → files, specs → tasks using `hyphae_memoir_link`

**CLI→MCP tool mapping**:
| CLI Command | MCP Tool | Purpose |
|---|---|---|
| `hyphae_memory_store` | store-memory | Author/save spec text |
| `hyphae_ingest_file` | ingest-document | Ingest existing PRD/ADR |
| `hyphae_memoir_create` | create-memoir | Start dependency graph |
| `hyphae_memoir_link` | link-concepts | Connect spec → files |
| `hyphae_search` | search-memories | Find specs by query |
| `hyphae_session_end` | store-session | Auto-capture work on specs |

## Phase 2: Rhizome Code Intelligence

Map doc-query tools to Rhizome for spec-aware code analysis.

**Doc-query→Rhizome mapping**:
| doc-query | Rhizome Tool | Verification |
|---|---|---|
| `q.codeowners()` | `list-codeowners` | Returns CODEOWNERS entries |
| `q.filesMatchingPattern()` | `find-by-pattern` | Regex matching on file paths |
| `q.functionsByTag()` | `search-by-tag` | LSP document symbols filtered |
| `q.dependencyGraph()` | `dependency-graph` | Language-aware call graph |
| `q.testCoverage()` | `coverage-summary` | Coverage metrics if available |

**Fidelity verification workflow**:
1. Author spec with `q.*` references → generates JSON query list
2. Run `spec-fidelity-review` agent → calls Rhizome tools for each query
3. Agent produces fidelity report: matching-files, coverage %, gaps
4. Author accepts/refines spec based on gaps

## Phase 3: Cortina Guardrail Hooks

Implement runtime hooks to enforce spec discipline during development.

**Block spec file reads**:
- Pre-hook on Read tool for `specs/` paths
- Require explicit `--with-spec` flag to read specs during active work
- Rationale: Focus on implementation, not spec-gazing

**Session-start context**:
- Post-hook on session initialize
- Auto-inject current spec + active tasks from Hyphae
- Set context variable: `$SPEC_ID`, `$SPEC_TASKS`, `$SPEC_JOURNAL`

**Stop auto-journal**:
- Post-hook on session end (Stop)
- Capture: files modified, tests run, spec status change
- Auto-update journal entry via `hyphae_session_end`
- Attach to spec memoir as episodic memory

## Phase 4: Lamella Skills

Define five new skills for spec authoring, planning, and maintenance.

**spec-plan**: Structured spec authoring
- Frontmatter: tool-version: 1, type: spec
- Input: project, feature-name, context-file
- Output: spec YAML (goals, acceptance-criteria, non-goals, risks, assumptions)
- Uses: `hyphae_memory_store`, `hyphae_ingest_file`

**spec-next**: Plan next tasks from spec
- Frontmatter: tool-version: 1, type: task-planner
- Input: spec-id
- Output: ranked task list with dependencies, estimates
- Uses: `hyphae_search`, `hyphae_memoir_link`

**spec-update**: Evolve specs based on findings
- Frontmatter: tool-version: 1, type: spec-evolution
- Input: spec-id, event (blocked/constraint-found/risk-realized)
- Output: updated spec, impact summary
- Uses: `hyphae_memory_store`, `hyphae_search`

**spec-fidelity-review**: Verify spec against codebase
- Frontmatter: tool-version: 1, type: fidelity-check
- Input: spec-id
- Output: fidelity report (coverage %, matched-files, gaps)
- Uses: Rhizome tools (via rhizome MCP server)

**spec-orchestrator**: Multi-spec coordination
- Frontmatter: tool-version: 1, type: orchestrator
- Input: project-id, phase
- Output: active-specs, dependencies, blockers
- Uses: `hyphae_search`, `hyphae_memoir_link`

## Phase 5: Agent

**spec-orchestrator agent**: Coordinate multi-spec workflows
- Input: project state, current phase
- Process: Query Hyphae for active specs + dependencies; check Cortina journals for progress
- Output: prioritized spec queue, blockers, ready-for-handoff specs
- Loops: Runs after spec-update or spec-next; surfaces new blockers

## Phase 6: Session Resumability

Enable seamless spec context across session boundaries.

**/clear + resume pattern**:
1. Developer runs `/clear` before session end → triggers Cortina stop hook
2. Hook auto-stores session summary + active spec reference
3. New session starts → hook injects `$SPEC_ID`, `$SPEC_TASKS`
4. Developer runs `/resume-spec` → hydrates context from Hyphae

## Implementation Steps

1. **Hyphae schemas**: Create spec, task, journal memory schemas in spore/hyphae
2. **Rhizome mappings**: Document query tool → Rhizome tool equivalences; test fidelity on 3 samples
3. **Cortina hooks**: Add pre-hook (block spec reads), post-hook (session-start inject), stop hook (auto-journal)
4. **Lamella skills**: Write spec-plan, spec-next, spec-update, spec-fidelity-review
5. **Skill frontmatter**: Add frontmatter metadata (tool-version, type)
6. **Agent**: Build spec-orchestrator agent; integrate with planning/fix-planner.md
7. **Integration tests**: Test spec creation → task planning → fidelity review → update flow
8. **Documentation**: Write spec-usage guide; add examples for different project types
9. **Release**: Tag as phase-1 feature; gather feedback from early adopters

## Dependencies & Risks

**Dependencies**:
- Hyphae: memoir + search (required for Phase 1)
- Rhizome: tool discovery + LSP (required for Phase 2)
- Cortina: hooks API (required for Phase 3)
- Spore: schema registration (required for Phase 1)

**Risks**:
1. **Rhizome LSP availability** — Not all languages have fast LSP. Mitigation: Fallback to tree-sitter; document which languages have full fidelity.
2. **Spec drift** — Specs updated out of band (no hook). Mitigation: Cortina hook on file write to `specs/` paths; auto-update journal.
3. **Session context bloat** — Injecting 50+ spec tasks per session. Mitigation: Filter to active-only tasks; paginate in Cortina hook.
4. **Circular spec dependencies** — A depends on B, B depends on A. Mitigation: Add cycle-detection in spec-orchestrator; surface as blocker.
5. **Memory quota exhaustion** — Large projects with 100+ specs. Mitigation: Archive old specs; implement retention policy (30-day archive).

## Success Criteria

- [ ] Hyphae stores 50+ spec documents with full search/retrieval
- [ ] Rhizome query fidelity ≥85% for codeowner/pattern/dependency lookups
- [ ] Cortina hooks auto-journal 95% of spec-related sessions
- [ ] spec-plan skill generates valid YAML specs in <5s
- [ ] spec-next skill produces executable task lists (3+ tasks per spec)
- [ ] spec-orchestrator surfaces blockers within 30s for 10+ active specs
- [ ] Session context injection works across 5+ spec types (feat, fix, doc, refactor, perf)
- [ ] Zero spec data loss across session boundary (Stop → new session → `/resume-spec`)
- [ ] Integration test suite passes (spec creation → task → fidelity → update flow)
- [ ] Spec usage guide adopted by 3+ projects in basidiocarp

## Open Questions

1. **Spec versioning**: Store multiple versions in Hyphae, or keep current + archive separately?
2. **Task granularity**: Link tasks to PRs/commits? If yes, how to maintain when specs are archived?
3. **Multi-project specs**: Can a single spec reference files across multiple repos? How to handle Rhizome tool calls?
4. **Spec templates**: Pre-built templates (RFC, ADR, PRD, bug-fix) in resources/templates/specs/?
5. **Permission model**: Can developers edit specs they didn't author? Requires Hyphae access control?
6. **Audit trail**: Full edit history per spec? Or just journal entries? Storage implications?
