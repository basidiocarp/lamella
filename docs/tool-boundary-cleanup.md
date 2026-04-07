# Tool Boundary Cleanup

This document turns the March 2026 Lamella tool audit into a concrete cleanup
plan.

Status: Phase 2 is complete. Lamella now routes session-end summaries through
Cortina Stop and no longer ships the fallback wrapper.

Lamella should stay focused on packaging, validation, manifests, hook
templates, and workflow distribution. Runtime lifecycle capture belongs in
`cortina`. Host install, repair, and doctor flows belong in `stipe`. Session
storage and transcript ingestion belong in `hyphae`. Operator-facing session
and telemetry views belong in `cap`.

## Scope

This cleanup plan covers `tools/`, `scripts/hooks/`, `scripts/maintenance/`,
and the wrapper and build surfaces that should remain Lamella-owned. It does
not attempt to redesign skills, manifests, or plugin boundaries beyond what is
needed to clarify ownership.

## Canonical Ownership

| Area | Canonical owner |
|---|---|
| Plugin packaging, marketplace builds, Codex exports, validators | `lamella` |
| Lifecycle capture, normalized hook runtime, Hyphae or Rhizome side effects | `cortina` |
| Host setup, install, repair, doctor, hook registration | `stipe` |
| Session persistence, transcript ingestion, structured session APIs | `hyphae` |
| Session dashboards, usage telemetry, operator analytics | `cap` |
| One-off personal utilities with no product boundary | spin out or retire |

## Keep In Lamella

These files still match Lamella's product boundary and should remain here.

| Path | Action | Notes |
|---|---|---|
| `lamella` | Keep | Primary user-facing wrapper for build, install, list, update, and Codex export flows. |
| `Makefile` | Keep | Local validation and build entrypoint. |
| `builders/` | Keep | Core Claude and Codex packaging pipeline. |
| `scripts/build/` | Keep | Build-time subagent emission and export helpers. |
| `scripts/ci/` | Keep | Source and build validators. |
| `scripts/audit/` | Keep | Lamella corpus audit helpers. |
| `scripts/maintenance/add-toc-to-skills.py` | Keep | Authoring hygiene. |
| `scripts/maintenance/add-triggers.py` | Keep | Authoring hygiene. |
| `scripts/maintenance/fix-skill-frontmatter.py` | Keep | Skill corpus normalization. |
| `scripts/maintenance/haiku-friendly-rewrites.py` | Keep | Content-maintenance helper. |
| `scripts/maintenance/sync-manifests-with-folders.py` | Keep | Packaging consistency. |
| `scripts/maintenance/zip-skills.sh` | Keep | Packaging helper. |
| `scripts/maintenance/check_upstream_action_surface.sh` | Keep | Lamella wrapper compatibility check. |
| `scripts/hooks/session-start.js` | Keep | Session-start UX and skill-hint injection, not normalized lifecycle capture. |
| `scripts/hooks/capture-pr-reviews.js` | Keep for now | Workflow-specific Hyphae capture; revisit only after the narrow Cortina boundary is stable. |
| `scripts/hooks/evaluate-session.js` | Keep for now | Lamella continuous-learning behavior. |
| `scripts/hooks/pre-write-doc-warn.js` | Keep | Local workflow guidance. |
| `scripts/hooks/suggest-compact.js` | Keep | Local workflow guidance. |
| `scripts/hooks/pre-compact.js` | Keep | Local workflow guidance. |
| `scripts/hooks/post-edit-format.js` | Keep | Edit-time UX. |
| `scripts/hooks/post-edit-typecheck.js` | Keep | Edit-time UX. |
| `scripts/hooks/post-edit-console-warn.js` | Keep | Edit-time UX. |
| `scripts/hooks/comment-style-check.sh` | Keep as supported Bash variant alongside `comment-style-check.js` | Authoring style guidance; default shipped path is now Node-based. |
| `scripts/hooks/check-console-log.js` | Keep | Local quality reminder. |

## Move To Cortina

These were duplicate or legacy lifecycle-runtime implementations. The four
standalone capture helpers have now been deleted from Lamella; Cortina owns
their shipped runtime behavior.

| Path | Action | Target |
|---|---|---|
| `scripts/hooks/capture-errors.js` | Deleted from Lamella | `cortina` post-tool-use runtime |
| `scripts/hooks/capture-corrections.js` | Deleted from Lamella | `cortina` post-tool-use runtime |
| `scripts/hooks/capture-test-results.js` | Deleted from Lamella | `cortina` post-tool-use runtime |
| `scripts/hooks/capture-code-changes.js` | Deleted from Lamella | `cortina` post-tool-use runtime |
| `scripts/hooks/session-end.js` | Deleted from Lamella after Cortina Stop coverage was confirmed | `cortina` stop runtime |

### Cortina Cleanup Exit Criteria

- `resources/hooks/hooks.json` no longer relies on Lamella-owned runtime logic
  for session-end summary storage.
- Lamella docs describe `cortina` as the runtime owner for reusable
  `PostToolUse` and `Stop` capture behavior.
- Legacy capture helpers are removed rather than kept as silent duplicates.

## Move To Stipe

These are host-management scripts, not Lamella packaging.

| Path | Action | Target |
|---|---|---|
| `scripts/maintenance/check-claude.sh` | Moved to `stipe/scripts/claude/check-claude.sh`; deleted from Lamella | `stipe` doctor or host repair surface |
| `scripts/maintenance/clean-reinstall-claude.sh` | Moved to `stipe/scripts/claude/clean-reinstall-claude.sh`; deleted from Lamella | `stipe` host repair surface |

### Stipe Cleanup Exit Criteria

- Claude-specific repair guidance lives next to other host setup and doctor
  logic.
- Lamella no longer ships standalone install or reinstall helpers for Claude
  itself.

## Migrate To Cap-Oriented Analytics

Only one session utility has a clear ecosystem home.

| Path | Action | Target |
|---|---|---|
| `tools/session/session-stats.sh` | Fold the reporting surface into existing telemetry or usage views, then retire the shell script | `cap` with `hyphae` and transcript-backed data as needed |

### Analytics Cleanup Exit Criteria

- The useful outputs from `session-stats.sh` are visible in `cap` telemetry or
  usage views.
- Lamella no longer needs a separate analytics shell script for Claude logs.

## Retire Or Spin Out

These tools do not belong to Lamella's maintained product boundary. Keep them
only if you deliberately create a separate home for them.

| Path | Action | Reason |
|---|---|---|
| `tools/session/cc-sessions.py` | Spin out or retire | Personal Claude-local transcript index and resume helper. |
| `tools/session/session-search.sh` | Spin out or retire | Personal Claude-local search helper. |
| `tools/session/fresh-context-loop.sh` | Spin out or retire | Workflow pattern script, not Lamella packaging. |
| `tools/github/` | Spin out or retire | Generic GitHub issue automation, much of it hardcoded to `anthropics/claude-code`. |
| `tools/skills-ref/` | Spin out or retire | Standalone reference library, explicitly not a production Lamella dependency. |
| `scripts/maintenance/sync-claude-config.sh` | Deleted from Lamella | Personal dotfiles-style backup and sync utility for `~/.claude`. |
| `scripts/release/extract-changelog-entry.sh` | Keep in Lamella | Release workflow still uses it to extract tagged changelog notes. |

## Sequencing

1. Cut the Cortina cleanup pass.
   Remove legacy lifecycle helpers from Lamella after Cortina registration and
   fallback semantics are confirmed.
2. Cut the Stipe host-maintenance pass.
   Absorb Claude repair and doctor behavior into `stipe`, then delete Lamella's
   copies. This is now complete for the two standalone Claude shell helpers.
3. Decide whether `session-stats.sh` is worth productizing in `cap`.
   If not, retire it with the rest of `tools/session/`.
4. Spin out or delete the remaining `tools/` utilities.
   Do not leave them in Lamella as undocumented sidecars.
5. Update docs after each move.
   Keep `docs/index.md`, `docs/roadmap.md`, and the hook docs aligned with the
   actual runtime boundary.

## Done Means

Lamella is left with packaging, validators, hook templates, and intentional
workflow helpers. `cortina` is the only owner of reusable lifecycle capture
runtime. `stipe` is the only owner of Claude install, repair, and doctor
flows. `cap` owns any retained session analytics UX. `tools/` no longer acts
as a miscellaneous holding area inside Lamella.
