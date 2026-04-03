# Claude Skill Import Candidates: matt-skills Port Matrix

This document preserves the `matt-skills` review as a decision matrix rather than just a shortlist.

## Port

- `ubiquitous-language`
  Proposed destination: `customer-insights` or new `domain-modeling`
  Reason: low coupling, low overlap, and it produces a durable domain glossary Lamella does not really have.
- `design-an-interface`
  Proposed destination: `core` or `platform-engineering`
  Reason: strong divergent-design technique that complements existing API and architecture skills.
- `improve-codebase-architecture`
  Proposed destination: `core`
  Reason: the deep-module and architecture-friction lens is portable if Lamella trims it to analysis and recommendation output.
- `grill-me`
  Proposed destination: `workshops` or `collaboration`
  Reason: compact design-stress-test workflow with a clear interaction model.

## Merge Into Existing Skills

- `write-a-prd`
  Merge target: `agile-pm/deliver-prd`
  Reason: too close to Lamella's existing PRD stack to stand on its own.
- `prd-to-plan`
  Merge target: `workflow/create-plans`
  Reason: the useful part is the tracer-bullet phrasing, not a separate capability.
- `prd-to-issues`
  Merge target: `workflow/create-plans` or `agile-pm/deliver-user-stories`
  Reason: useful decomposition pattern, but too GitHub-issue-shaped for a standalone Lamella skill.
- `request-refactor-plan`
  Merge target: `workflow/create-plans` or a future refactor-planning skill
  Reason: mostly planning plus issue output, not a distinct domain.
- `triage-issue`
  Merge target: `core/systematic-debugging`, `workflow/git-analyze-issue`, or a future `developer-ops` skill
  Reason: useful shape, but heavily overlapped with current debugging and issue-analysis flows.
- `setup-pre-commit`
  Merge target: future `developer-experience` plugin or a broader repo-setup skill
  Reason: good idea, but too Husky and lint-staged specific in current form.
- `git-guardrails-claude-code`
  Merge target: `meta/create-hook`
  Reason: better as a hook example or reference pattern than a top-level skill.

## Reject

- `tdd`
  Reason: redundant with Lamella's existing TDD and testing coverage.
- `write-a-skill`
  Reason: redundant with `create-skill` and `skill-best-practices`.
- `edit-article`
  Reason: too thin relative to Lamella's current writing stack.
- `obsidian-vault`
  Reason: hardcoded vault path and redundant with Lamella's general `obsidian` skill.
- `migrate-to-shoehorn`
  Reason: too niche and too tied to one package.
- `scaffold-exercises`
  Reason: repo-specific exercise and lint workflow make it non-portable.

## Recommended First Ports

If the goal is to carry over the best ideas with the least churn:

1. `ubiquitous-language`
2. `design-an-interface`
3. `grill-me`
4. `improve-codebase-architecture`

## Notes

- The strongest `matt-skills` ideas are workflow shapes, not subject-matter breadth.
- Several of the weaker candidates are good source material for references or examples even when they are not good standalone Lamella imports.
