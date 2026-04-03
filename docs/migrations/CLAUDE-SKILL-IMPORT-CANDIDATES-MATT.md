# Claude Skill Import Candidates: matt-skills

This audit reviews `potential-claude-skills/matt-skills` and evaluates which skills look portable into Lamella.

The main filter here is not quality. The source set is fairly high-signal. The real filters are:

- overlap with existing Lamella skills
- repo-specific assumptions
- dependence on one toolchain or one ecosystem
- whether the core idea is reusable after adaptation

## Import First

These are the best candidates to port with relatively low adaptation cost.

- `design-an-interface`
  Proposed category: `api-and-integration` or `core`
  Reason: strong interface-design workflow that is distinct from Lamella's current API and architecture skills.
- `grill-me`
  Proposed category: `workshops`
  Reason: useful stress-test and design-challenge format with a clear interactive identity.
- `ubiquitous-language`
  Proposed category: `customer-insights` or new `domain-modeling`
  Reason: good DDD-oriented terminology hardening skill that Lamella does not currently package directly.
- `setup-pre-commit`
  Proposed category: `developer-experience`
  Reason: practical onboarding and repo-hygiene workflow that is additive if broadened beyond the Node-only default.

## Adapt Before Porting

These look valuable, but they need a real rewrite before they belong in Lamella.

- `improve-codebase-architecture`
  Proposed category: `core`
  Reason: good architectural lens around deep modules and testability, but it overlaps current refactor and architecture skills enough that it needs a sharper angle.
- `request-refactor-plan`
  Proposed category: `workflow`
  Reason: useful tiny-commit refactor planning pattern, but it is too GitHub-issue-centric as written.
- `prd-to-plan`
  Proposed category: `workflow` or `agile-pm`
  Reason: useful vertical-slice planning model, but Lamella already has strong planning coverage and this would need to differentiate clearly.
- `prd-to-issues`
  Proposed category: `workflow` or `agile-pm`
  Reason: potentially useful issue-slicing workflow, but it assumes GitHub issues and overlaps current planning and decomposition skills.
- `triage-issue`
  Proposed category: `developer-ops` or `workflow`
  Reason: useful bug triage pattern, but it overlaps `systematic-debugging`, `git-analyze-issue`, and TDD workflows.
- `edit-article`
  Proposed category: `writing`
  Reason: useful editing skill, but it is thinner than Lamella's current writing stack and would need a clearer angle.
- `git-guardrails-claude-code`
  Proposed category: `meta` or `developer-experience`
  Reason: interesting safety workflow, but it is tightly tied to Claude Code hooks and needs cross-platform and cross-agent adaptation.
- `write-a-prd`
  Proposed category: `agile-pm`
  Reason: good workflow, but too close to Lamella's existing PRD and planning skills to import directly.

## Probably Skip

These are either too narrow, too coupled, or already covered well enough in Lamella.

- `tdd`
  Reason: Lamella already has strong TDD coverage.
- `write-a-skill`
  Reason: Lamella already has `create-skill`, `skill-best-practices`, and related meta skills.
- `obsidian-vault`
  Reason: Lamella already has an Obsidian skill, and this version hardcodes a local vault path.
- `scaffold-exercises`
  Reason: too tied to a specific exercise repo structure and lint command.
- `migrate-to-shoehorn`
  Reason: too ecosystem-specific and too narrow unless Lamella wants a Total TypeScript niche.

## Best Category Fit

If you decide to port from `matt-skills`, the cleanest homes would be:

- `design-an-interface` -> `api-and-integration`
- `grill-me` -> `workshops`
- `ubiquitous-language` -> `customer-insights` or `domain-modeling`
- `setup-pre-commit` -> `developer-experience`
- `request-refactor-plan` -> `workflow`
- `triage-issue` -> `developer-ops`

## Recommended Order

If the goal is to import only the highest-signal ideas first, I would do them in this order:

1. `design-an-interface`
2. `ubiquitous-language`
3. `grill-me`
4. `setup-pre-commit`
5. `request-refactor-plan`

## Notes

- `matt-skills` is much more coherent than some of the bigger candidate sources. The main problem is overlap, not quality.
- The strongest contributions are workflow shapes and domain framing patterns, not raw subject-matter breadth.
- Several of these skills assume GitHub issues are the canonical output. That is fine if Lamella wants to lean harder into GitHub-native workflows, but it should be a deliberate choice.
