# Claude Skill Import Candidates: Developer-Biased

This shortlist captures viable developer-facing import candidates from the local `potential-claude-skills/` repos.

It is intentionally filtered:
- toward additive coverage for Lamella
- away from obvious duplication of existing plugins
- away from generic "senior X" personas when Lamella already has a stronger domain skill

## Highest Priority Imports

- `codebase-onboarding`
  Source: `potential-claude-skills/claude-skills`
  Reason: good fit for repo onboarding and codebase orientation, which Lamella does not cover as a first-class skill today.
- `incident-commander`
  Source: `potential-claude-skills/claude-skills`
  Reason: strong operational workflow candidate with distinct value from current devops and security skills.
- `release-manager`
  Source: `potential-claude-skills/claude-skills`
  Reason: release coordination is still underrepresented compared with build, test, and deploy guidance.
- `runbook-generator`
  Source: `potential-claude-skills/claude-skills`
  Reason: useful operational documentation skill with broad engineering value.
- `mcp-server-builder`
  Source: `potential-claude-skills/claude-skills`
  Reason: additive to Lamella's existing MCP integration guidance because it targets building servers, not just wiring them in.
- `monorepo-navigator`
  Source: `potential-claude-skills/claude-skills`
  Reason: useful companion to monorepo management, focused more on orientation and navigation.
- `tech-debt-tracker`
  Source: `potential-claude-skills/claude-skills`
  Reason: concrete debt triage and scoring workflow that Lamella does not currently package directly.
- `api-test-suite-builder`
  Source: `potential-claude-skills/claude-skills`
  Reason: useful if you want stronger API test generation and contract-test coverage than the current testing mix provides.
- `atlassian-admin`
  Source: `potential-claude-skills/claude-skills`
  Reason: useful if you want admin-oriented Jira and Confluence automation rather than only end-user workflow help.
- `database-schema-designer`
  Source: `potential-claude-skills/claude-skills`
  Reason: database coverage in Lamella is still small, and schema/ERD design is a real gap.
- `observability-designer`
  Source: `potential-claude-skills/claude-skills`
  Reason: valuable if you want stronger tracing, dashboards, and production observability design patterns.

## Good Secondary Candidates

- `dependency-auditor`
  Source: `potential-claude-skills/claude-skills`
  Reason: useful if you want a dedicated dependency hygiene and risk workflow beyond existing security scans.
- `skill-tester`
  Source: `potential-claude-skills/claude-skills`
  Reason: potentially useful for Lamella itself because it focuses on validating skills as skills.
- `spec-driven-workflow`
  Source: `potential-claude-skills/claude-skills`
  Reason: useful if you want a more explicit spec-first workflow package beyond current planning skills.
- `google-workspace-cli`
  Source: `potential-claude-skills/claude-skills`
  Reason: niche, but valuable if internal automation around Workspace matters.
- `ms365-tenant-manager`
  Source: `potential-claude-skills/claude-skills`
  Reason: similar rationale to Google Workspace, especially for IT-heavy internal ops.
- `stripe-integration-expert`
  Source: `potential-claude-skills/claude-skills`
  Reason: adds a concrete payments integration niche that Lamella does not currently cover directly.
- `soc2-compliance`
  Source: `potential-claude-skills/claude-skills`
  Reason: useful if you want audit-readiness and control-mapping coverage that is more compliance-oriented than current security skills.
- `senior-data-engineer`
  Source: `potential-claude-skills/claude-skills`
  Reason: useful if you want dedicated data-platform guidance rather than folding everything into Python or microservices.
- `senior-data-scientist`
  Source: `potential-claude-skills/claude-skills`
  Reason: useful if your teammate set includes analytics or experimentation-heavy work.
- `aws-solution-architect`
  Source: `potential-claude-skills/claude-skills`
  Reason: worth reviewing if you want broader cloud-architecture coverage beyond Atmos and serverless-specific patterns.
- `azure-cloud-architect`
  Source: `potential-claude-skills/claude-skills`
  Reason: useful only if Azure coverage is a target gap.
- `gcp-cloud-architect`
  Source: `potential-claude-skills/claude-skills`
  Reason: useful only if GCP coverage is a target gap.

## Framework or Domain Gap Candidates

- `astro`
  Source: `potential-claude-skills/antigravity-awesome-skills`
  Reason: Lamella has strong frontend coverage, but not framework-specific Astro guidance.
- `algolia-search`
  Source: `potential-claude-skills/antigravity-awesome-skills`
  Reason: useful if you want hosted-search implementation guidance distinct from database or RAG patterns.
- `android-jetpack-compose-expert`
  Source: `potential-claude-skills/antigravity-awesome-skills`
  Reason: strong mobile-native addition because Lamella currently has little or no Android-specific coverage.
- `api-testing-observability-api-mock`
  Source: `potential-claude-skills/antigravity-awesome-skills`
  Reason: useful if you want dedicated API mocking and test-environment support beyond current testing skills.
- `apify-actor-development`
  Source: `potential-claude-skills/antigravity-awesome-skills`
  Reason: good niche candidate for cloud scraping and automation-worker workflows.
- `airflow-dag-patterns`
  Source: `potential-claude-skills/antigravity-awesome-skills`
  Reason: valuable if you want first-class data-pipeline orchestration coverage.
- `async-python-patterns`
  Source: `potential-claude-skills/antigravity-awesome-skills`
  Reason: only worth importing if it materially improves on Lamella's current Python coverage.
- `appdeploy`
  Source: `potential-claude-skills/antigravity-awesome-skills`
  Reason: worth a look if it provides concrete deployment workflows rather than generic advice.

## Low Priority or Likely Redundant

- `browser-automation`
  Reason: Lamella already has strong browser automation and Playwright coverage.
- `docker-development`
  Reason: Lamella already has substantial Docker and devops coverage.
- `helm-chart-builder`
  Reason: Lamella already has Helm and Kubernetes-oriented skills.
- `pr-review-expert`
  Reason: Lamella already has strong code review workflows.
- `rag-architect`
  Reason: Lamella already has a RAG plugin and related retrieval skills.
- `agent-designer`
  Reason: Lamella already has strong agent and workflow authoring coverage.
- `agenthub`
  Reason: interesting, but it is close to existing multi-agent and worktree patterns.
- `tdd-guide`
  Reason: Lamella already has strong TDD and test-writing coverage.
- `senior-frontend`
  Reason: Lamella already has broad frontend and TypeScript coverage.
- `senior-backend`
  Reason: Lamella already covers a large share of backend patterns already.
- `senior-devops`
  Reason: Lamella already has deep devops coverage.
- `senior-security`
  Reason: Lamella already has a strong security plugin.
- `playwright-pro`
  Reason: too redundant with the existing Playwright and E2E skills.

## Notes

- The best developer imports are the ones that add operational workflows or repo-maintenance workflows, not more generic engineering personas.
- The strongest gaps today appear to be onboarding, release management, incident handling, runbooks, tech debt, MCP server authoring, and database schema design.
- Angular-related candidates were intentionally dropped from the migration backlog.
