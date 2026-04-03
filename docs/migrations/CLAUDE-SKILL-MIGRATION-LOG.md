# Claude Skill Migration Log

This log tracks imports, renames, merges, and deferrals while porting skills from the `CLAUDE-SKILL-IMPORT` candidate documents into Lamella.

Category note: Lamella's later category reorganization moved the user-facing plugin boundaries. Some older entries below still mention temporary homes such as "kept in `agile-pm` pending the later category pass." Those notes are historical. The current plugin grouping lives in `lamella/manifests/claude/`.

## Status Key

- `imported` — added as a Lamella skill
- `merged` — absorbed into an existing Lamella skill or reference set
- `deferred` — still a candidate, but not migrated yet
- `rejected` — intentionally not ported

## Imported

| Date | Candidate | Lamella Destination | Status | Notes |
|------|-----------|---------------------|--------|-------|
| 2026-03-26 | `culture-architect` | `agile-pm/company-culture-design` | imported | Renamed to foreground culture design as an operating practice rather than the source repo's persona framing. Kept as a temporary `agile-pm` fit pending the later category pass. |
| 2026-03-26 | `design-an-interface` | `core/interface-design-variants` | imported | Renamed for clearer discovery and Lamella-style phrasing. |
| 2026-03-26 | `codebase-onboarding` | `core/codebase-onboarding` | imported | Kept as a standalone onboarding skill with a repository scanner script and a concise onboarding template. |
| 2026-03-26 | `database-schema-designer` | `database/database-schema-designer` | imported | Kept as a standalone schema-design skill because Lamella's database plugin needed a requirements-first design workflow before PostgreSQL tuning. |
| 2026-03-26 | `founder-coach` | `collaboration/founder-leadership-coaching` | imported | Renamed to emphasize founder bottleneck diagnosis, delegation, and leadership growth rather than generic coaching language. |
| 2026-03-26 | `executive-onboarding-playbook` | `agile-pm/executive-onboarding-diagnostic` | imported | Renamed to foreground a first-90-days diagnostic workflow for new VP and CPO roles instead of a generic onboarding playbook. |
| 2026-03-26 | `feature-investment-advisor` | `agile-pm/evaluate-feature-investment` | imported | Renamed to foreground feature-level ROI, cost structure, and strategic override analysis as a direct build versus defer decision aid. |
| 2026-03-26 | `press-release` | `agile-pm/deliver-working-backwards-press-release` | imported | Renamed to foreground the Amazon-style Working Backwards artifact as a planning tool rather than a launch-day PR deliverable. |
| 2026-03-26 | `pricing-strategy` | `agile-pm/define-pricing-strategy` | imported | Renamed to foreground pricing design, packaging, price-point choice, pricing-page pressure tests, and price increase planning as one coherent decision surface. |
| 2026-03-26 | `grill-me` | `collaboration/stress-test-design` | imported | Renamed to describe the actual workflow rather than the source repo's tone. |
| 2026-03-26 | `improve-codebase-architecture` | `core/deep-module-review` | imported | Renamed to foreground the deep-module review method. Bundled reference content migrated and trimmed. |
| 2026-03-26 | `incident-commander` | `devops/incident-commander` | imported | Split out as a live-response skill with severity classification, role separation, communication cadence, and timeline reconstruction. |
| 2026-03-26 | `api-test-suite-builder` | `core/api-test-suite-builder` | imported | Kept as a standalone API-focused testing skill because it adds route-matrix and handler-coverage guidance beyond Lamella's generic test-writing workflow. |
| 2026-03-26 | `atlassian-admin` | `agile-pm/atlassian-workspace-admin` | imported | Renamed to foreground workspace administration instead of generic product branding. Kept as a temporary `agile-pm` fit pending the later category pass. |
| 2026-03-26 | `analytics-tracking` | `tools/analytics-tracking` | imported | Kept as a standalone implementation skill with event taxonomy, GTM patterns, and a small deterministic tracking-plan generator. |
| 2026-03-26 | `board-deck-builder` | `agile-pm/board-update-decks` | imported | Renamed to foreground the reporting artifact rather than the source repo's builder phrasing. Kept as a temporary `agile-pm` fit pending the later category pass. |
| 2026-03-26 | `change-management` | `agile-pm/manage-change-rollout` | imported | Renamed to focus on the rollout workflow and condensed around stakeholder messaging, enablement, and reinforcement. |
| 2026-03-26 | `company-os` | `agile-pm/company-operating-rhythm` | imported | Renamed to make the operating-rhythm concept clearer for Lamella discovery and trimmed to the ownership, scorecard, cadence, and rollout backbone. |
| 2026-03-26 | `company-research` | `agile-pm/discover-company-profile` | imported | Renamed to focus on a single-company research brief with executive, product, and operating signals rather than a generic research prompt. |
| 2026-03-26 | `content-strategy` | `writing/content-strategy` | imported | Kept as a standalone planning skill because Lamella needed a strategy-first surface for pillars, topic clusters, and buyer-stage coverage before drafting starts. |
| 2026-03-26 | `discovery-interview-prep` | `agile-pm/plan-discovery-interviews` | imported | Renamed to foreground pre-interview planning, participant selection, guide design, and bias control as a distinct workflow before synthesis. |
| 2026-03-26 | `confluence-expert` | `agile-pm/confluence-knowledge-ops` | imported | Renamed to emphasize space design and documentation operations rather than generic expertise language. |
| 2026-03-26 | `director-readiness-advisor` | `agile-pm/director-transition-coaching` | imported | Renamed to focus on PM-to-Director transition coaching, interview framing, and early-role recalibration instead of the source repo's advisor framing. |
| 2026-03-26 | `email-sequence` | `writing/email-sequence` | imported | Kept as a standalone writing skill because lifecycle sequence design, cadence, and CTA progression were more specific than Lamella's general content drafting workflow. |
| 2026-03-26 | `dependency-auditor` | `security/dependency-auditor` | imported | Kept as a standalone multi-ecosystem dependency audit skill spanning vulnerability, license, freshness, and upgrade concerns. |
| 2026-03-26 | `google-workspace-cli` | `tools/google-workspace-operations` | imported | Renamed to foreground Workspace operations and trimmed to the highest-value doctor, auth, audit, and output-analysis workflows. |
| 2026-03-26 | `ms365-tenant-manager` | `tools/microsoft-365-tenant-admin` | imported | Renamed to foreground tenant administration and trimmed to the highest-value PowerShell recipes, security baseline, and troubleshooting workflows. |
| 2026-03-26 | `mcp-server-builder` | `tools/mcp-server-builder` | imported | Kept as a standalone build-side companion to `tools/mcp-integration`, with OpenAPI scaffold and manifest validation scripts. |
| 2026-03-26 | `release-manager` | `devops/release-manager` | imported | Kept as a standalone release workflow skill with trimmed changelog, version bump, and release readiness scripts. |
| 2026-03-26 | `runbook-generator` | `devops/runbook-generator` | imported | Kept as a standalone operational documentation skill with a runbook skeleton generator. |
| 2026-03-26 | `org-health-diagnostic` | `agile-pm/organizational-health-diagnostic` | imported | Renamed to remove the abbreviation, condensed around red-yellow-green health reviews, and kept with the imported scoring script and stage benchmarks. |
| 2026-03-26 | `scenario-war-room` | `workflow/compound-scenario-planning` | imported | Renamed to emphasize compound scenario modeling, trigger design, and hedging workflows instead of the source repo's war-room framing. |
| 2026-03-26 | `spec-driven-workflow` | `workflow/spec-driven-workflow` | imported | Kept as a standalone spec-first companion to `create-plans`, with spec generation, validation, and test-extraction scripts. |
| 2026-03-26 | `storyboard` | `agile-pm/storyboard` | imported | Kept as a standalone storyboard skill because journey-to-screen narrative framing and six-frame communication were distinct from Lamella's existing discovery and deck artifacts. |
| 2026-03-26 | `strategic-alignment` | `workflow/strategy-execution-alignment` | imported | Renamed to emphasize the cascade from strategy to team execution and kept with the imported alignment-checker script. |
| 2026-03-26 | `tech-debt-tracker` | `core/tech-debt-tracker` | imported | Kept as a standalone debt-management workflow with scan, prioritization, and trend scripts instead of scattering that behavior across review skills. |
| 2026-03-26 | `tam-sam-som-calculator` | `agile-pm/discover-market-sizing` | imported | Renamed to foreground market sizing as a decision aid and kept with a small deterministic calculator script for TAM, SAM, and SOM. |
| 2026-03-26 | `ubiquitous-language` | `agile-pm/ubiquitous-language` | imported | Kept the original name because it is already the clearest domain term. |
| 2026-03-26 | `vp-cpo-readiness-advisor` | `agile-pm/vp-cpo-transition-coaching` | imported | Renamed to focus on executive-transition coaching, role evaluation, alliance building, and early-role repair rather than the source repo's advisor framing. Moved from `collaboration` to `agile-pm` after the category-fit review. |
| 2026-03-26 | `jira-expert` | `agile-pm/jira-project-operations` | imported | Renamed to describe the project-level operational surface and kept separate from org-level Atlassian administration. |
| 2026-03-26 | `customer-journey-map` | `agile-pm/map-customer-journey` | imported | Renamed to foreground the cross-functional lifecycle artifact and trimmed to stages, touchpoints, emotions, KPIs, and team ownership. |
| 2026-03-26 | `soc2-compliance` | `security/soc2-compliance` | imported | Kept as a standalone compliance-readiness skill because SOC 2 scope selection, control mapping, and evidence planning are distinct from general secure-coding and audit-process guidance. |
| 2026-03-26 | `pestel-analysis` | `agile-pm/discover-pestel-analysis` | imported | Renamed to fit Lamella's research naming pattern and trimmed to macro-environment signals, product impact, and strategic implications. |
| 2026-03-26 | `spline-3d-integration` | `frontend/spline-3d-integration` | imported | Kept as a standalone frontend skill because Spline embeds have their own integration patterns, mobile fallbacks, and runtime gotchas that do not fit the generic frontend stack cleanly. |

## Merge Targets

| Date | Candidate | Lamella Destination | Status | Notes |
|------|-----------|---------------------|--------|-------|
| 2026-03-26 | `setup-pre-commit` | `meta/create-hook` | merged | Folded in as repo-guardrail guidance so Claude hooks and repo-native commit checks are presented as complementary layers. |
| 2026-03-26 | `request-refactor-plan` | `workflow/create-plans` | merged | Absorbed into `refactor-planning.md` and `plan-phase.md` as tiny-commit refactor guidance. |
| 2026-03-26 | `roadmap-planning` | `workflow/create-plans` | merged | Folded roadmap sequencing and release-structure guidance into the main planning workflow instead of adding another high-level planning entry point. |
| 2026-03-26 | `launch-strategy` | `agile-pm/deliver-launch-checklist` | merged | Folded channel strategy, phased rollout, Product Hunt, and post-launch momentum guidance into the launch checklist surface instead of adding another launch-planning entry point. |
| 2026-03-26 | `3d-web-experience` | `frontend/spline-3d-integration`, `frontend/threejs-advanced`, and `frontend/frontend-patterns` | merged | Folded the stack-selection matrix, GLB optimization guidance, and "3D for a purpose" guardrails into the narrower frontend 3D surfaces instead of importing a broad architecture wrapper. |
| 2026-03-26 | `design-spells` | `frontend/css-animation-creator` | merged | Folded in the high-value heuristics for identifying dull default moments, keeping motion narrative-fit, and adding delight without distraction. Dropped the source repo's mandate-heavy framing and stack-specific references. |
| 2026-03-26 | `prd-to-plan` | `workflow/create-plans` | merged | Absorbed into `vertical-slices.md`, `plan-format.md`, and `plan-phase.md` as tracer-bullet planning guidance. |
| 2026-03-26 | `prd-to-issues` | `workflow/create-plans` and `agile-pm/deliver-user-stories` | merged | Folded into vertical-slice planning guidance and story slice-readiness checks without preserving the GitHub-issue packaging. |
| 2026-03-26 | `product-strategy-session` | `agile-pm/define-problem-statement` | merged | Folded the strategy-refresh entry point into problem framing so broader product strategy work still starts from a clear user and business problem instead of a separate orchestration wrapper. |
| 2026-03-26 | `positioning-statement` | `agile-pm/discover-competitive-analysis` | merged | Folded the Geoffrey Moore positioning template and stress-test questions into competitive analysis rather than creating a separate narrow artifact skill. |
| 2026-03-26 | `triage-issue` | `core/systematic-debugging` | merged | Folded into `issue-triage.md` as a behavior-level handoff and TDD fix-plan pattern. |
| 2026-03-26 | `git-guardrails-claude-code` | `meta/create-hook` | merged | Added bundled Bash and PowerShell guardrail scripts plus project/user-scope setup guidance. |
| 2026-03-26 | `chief-of-staff` | `collaboration/expert-panel` | merged | Folded in only the portable synthesis pattern for multi-perspective outputs. Skipped the source routing and ecosystem assumptions that depend on a broader executive advisor stack. |
| 2026-03-26 | `monorepo-navigator` | `core/monorepo-management` | merged | Folded the analyzer, workspace-mapping guidance, and tooling references into the existing monorepo skill instead of creating a second overlapping monorepo entry point. |
| 2026-03-26 | `observability-designer` | `devops/slo-implementation`, `devops/prometheus-configuration`, and `devops/grafana-dashboards` | merged | Split the umbrella skill into focused SLO, alerting, and dashboard references plus generator scripts instead of adding another top-level observability router. |
| 2026-03-26 | `async-python-patterns` | `python/python-patterns` | merged | Folded the only durable additions into the existing async reference: bounded concurrency with semaphores and explicit cancellation cleanup. Skipped the generic shell and weaker legacy examples. |
| 2026-03-26 | `skill-tester` | `meta/skill-stocktake` | merged | Folded in as single-skill validation helpers plus a Lamella-specific rubric. Dropped the source repo's tier matrix and README requirements because they do not match Lamella's authoring model. |
| 2026-03-26 | `scroll-experience` | `frontend/css-animation-creator` | merged | Folded the story-beat framing, sticky-section heuristics, and anti-scroll-hijack guidance into the existing scroll animation reference instead of adding a second broad motion skill. |
| 2026-03-26 | `threejs-animation` | `frontend/threejs-advanced` | merged | Folded the useful animation material into one Three.js advanced skill instead of splitting Lamella into three narrowly scoped Three.js entries. |
| 2026-03-26 | `threejs-postprocessing` | `frontend/threejs-advanced` | merged | Folded the post-processing material into one Three.js advanced skill instead of splitting Lamella into three narrowly scoped Three.js entries. |
| 2026-03-26 | `threejs-shaders` | `frontend/threejs-advanced` | merged | Folded the shader material and displacement guidance into one Three.js advanced skill instead of splitting Lamella into three narrowly scoped Three.js entries. |
| 2026-03-26 | `ui-visual-validator` | `frontend/frontend-patterns` | merged | Folded the evidence-first visual QA workflow into a new frontend reference instead of importing a verbose overlapping skill with a broken reference path. |
| 2026-03-26 | `theme-factory` | `frontend/frontend-slides` | merged | Folded the strongest reusable presets into `STYLE_PRESETS.md` and dropped the wrapper workflow, generic PDF framing, and redundant minimalist theme. |
| 2026-03-26 | `internal-narrative` | `agile-pm/board-update-decks`, `agile-pm/manage-change-rollout`, and `agile-pm/company-operating-rhythm` | merged | Split the audience-translation and cadence material into the existing executive update, change rollout, and all-hands surfaces instead of adding another top-level narrative router. |
| 2026-03-26 | `write-a-prd` | `agile-pm/deliver-prd` | merged | Folded in as stronger interview, module-boundary, and testing-decision guidance plus template sections. |

## Deferred

| Date | Candidate | Status | Notes |
|------|-----------|--------|-------|
| 2026-03-26 | `acquisition-channel-advisor` | deferred | Still viable for a later go-to-market batch if growth-channel planning becomes a first-class Lamella surface. |
| 2026-03-26 | `ad-creative` | deferred | Still viable for a marketing-creative batch, but not strong enough to preempt the current product and workflow backlog. |
| 2026-03-26 | `ai-studio-image` | deferred | Still viable if Lamella adopts more image-generation workflows with a clear tool-agnostic shape. |
| 2026-03-26 | `airflow-dag-patterns` | deferred | Still viable if Lamella expands into data-platform and orchestration guidance. |
| 2026-03-26 | `algolia-search` | deferred | Still viable as a hosted-search integration skill if search implementation becomes a target gap. |
| 2026-03-26 | `algorithmic-art` | deferred | Still viable for a future delight-oriented visual batch if creative experiments become a priority. |
| 2026-03-26 | `android-jetpack-compose-expert` | deferred | Still viable if mobile-native coverage becomes a deliberate Lamella expansion area. |
| 2026-03-26 | `animejs-animation` | deferred | Still viable if Lamella adds a dedicated motion and animation track. |
| 2026-03-26 | `api-testing-observability-api-mock` | deferred | Still viable if Lamella later wants a more explicit API mocking and test-environment support workflow. |
| 2026-03-26 | `apify-actor-development` | deferred | Still viable if automation-worker and scraping workflows become a supported niche. |
| 2026-03-26 | `appdeploy` | deferred | Still viable if the external skill turns out to contain concrete deploy workflows rather than generic deployment advice. |
| 2026-03-26 | `astro` | deferred | Still viable if Lamella wants a framework-specific frontend expansion beyond React-centric coverage. |
| 2026-03-26 | `aws-solution-architect` | deferred | Still viable only if broader cloud-architecture guidance becomes a deliberate target gap. |
| 2026-03-26 | `azure-cloud-architect` | deferred | Still viable only if Azure coverage becomes a deliberate expansion target. |
| 2026-03-26 | `brand-guidelines` | deferred | Still viable for a broader brand and marketing operations lane. |
| 2026-03-26 | `business-health-diagnostic` | deferred | Still viable for a future business-ops or metrics-oriented batch. |
| 2026-03-26 | `campaign-analytics` | deferred | Still viable if Lamella expands its marketing analytics coverage beyond product instrumentation. |
| 2026-03-26 | `competitive-intel` | deferred | Still viable, but secondary to the product and discovery imports already completed. |
| 2026-03-26 | `competitive-landscape` | deferred | Still viable, but only as a distinct strategy workshop or presentation artifact beyond the current competitive-analysis stack. |
| 2026-03-26 | `copy-editing` | deferred | Still viable if Lamella adds a lighter editorial pass distinct from content planning and drafting. |
| 2026-03-26 | `copywriting` | deferred | Still viable if Lamella broadens its go-to-market writing stack beyond current planning and sequence workflows. |
| 2026-03-26 | `customer-journey-mapping-workshop` | deferred | Still viable as a facilitation-first workshop companion to the imported journey-map skill. |
| 2026-03-26 | `customer-success-manager` | deferred | Still viable if customer-success and post-sale operations become a first-class teammate workflow lane. |
| 2026-03-26 | `data-storytelling` | deferred | Still viable if presentation and analytics storytelling become a supported cross-functional lane. |
| 2026-03-26 | `design-md` | deferred | Still viable if Lamella adds a design-documentation or visual-spec authoring batch. |
| 2026-03-26 | `design-orchestration` | deferred | Still viable if Lamella adds more design-process and multi-turn creative workflow support. |
| 2026-03-26 | `discovery-process` | deferred | Still viable as a workshop-style discovery wrapper if facilitation coverage is expanded later. |
| 2026-03-26 | `eol-message` | deferred | Still viable as a concrete customer-communication artifact for sunset and migration announcements. |
| 2026-03-26 | `finance-based-pricing-advisor` | deferred | Still viable as a finance-heavy complement to the pricing skill already imported. |
| 2026-03-26 | `financial-analyst` | deferred | Still viable if Lamella adds a non-engineering finance support lane. |
| 2026-03-26 | `gcp-cloud-architect` | deferred | Still viable only if GCP coverage becomes a deliberate expansion target. |
| 2026-03-26 | `image-studio` | deferred | Still viable if Lamella later imports a broader image-generation lane instead of a single tool surface. |
| 2026-03-26 | `lean-ux-canvas` | deferred | Still viable as a facilitation-heavy workshop import if interactive product-design sessions become a target. |
| 2026-03-26 | `magic-ui-generator` | deferred | Still viable if Lamella wants a more playful UI ideation and component-variation workflow. |
| 2026-03-26 | `marketing-strategy-pmm` | deferred | Still viable, but broader than the current GTM imports and not yet differentiated enough to prioritize. |
| 2026-03-26 | `positioning-workshop` | deferred | Still viable as a workshop companion to the positioning content already merged into competitive analysis. |
| 2026-03-26 | `product-manager-toolkit` | deferred | Still viable only if it is later decomposed into smaller Lamella-shaped artifacts instead of imported as one broad wrapper. |
| 2026-03-26 | `revenue-operations` | deferred | Still viable if internal go-to-market operations and handoff workflows become a supported lane. |
| 2026-03-26 | `saas-metrics-coach` | deferred | Still viable if Lamella adds more finance and recurring-revenue analytics support. |
| 2026-03-26 | `screenshots` | deferred | Still viable because polished capture workflows would be useful for launches, docs, and teammate enablement. |
| 2026-03-26 | `scrum-master` | deferred | Still viable if Lamella adds more facilitation and ceremony support beyond current planning and retrospective coverage. |
| 2026-03-26 | `senior-data-engineer` | deferred | Still viable if Lamella later adds a dedicated data-platform and pipeline engineering lane. |
| 2026-03-26 | `senior-data-scientist` | deferred | Still viable if Lamella later adds a dedicated analytics and experimentation lane. |
| 2026-03-26 | `slack-gif-creator` | deferred | Still viable as a lightweight delight-oriented communication skill if playful teammate tooling becomes a priority. |
| 2026-03-26 | `social-content` | deferred | Still viable if Lamella expands into channel-specific publishing support. |
| 2026-03-26 | `social-media-manager` | deferred | Still viable if the social publishing lane becomes important enough to justify an operational wrapper skill. |
| 2026-03-26 | `stability-ai` | deferred | Still viable if Lamella later wants a localized, tool-aware image-generation workflow set. |
| 2026-03-26 | `steve-jobs` | deferred | Still viable only as an optional presentation-rehearsal or product-framing experiment, not as core Lamella guidance. |
| 2026-03-26 | `stitch-ui-design` | deferred | Still viable only if Lamella decides to support Google Stitch as a specific design tool surface. |
| 2026-03-26 | `stripe-integration-expert` | deferred | Still viable as a concrete payments-integration skill if commerce workflows become a target gap. |
| 2026-03-26 | `viral-generator-builder` | deferred | Still viable if Lamella later adds a more experimental marketing and shareability lane. |
| 2026-03-26 | `vizcom` | deferred | Still viable only if industrial-design and concept-render workflows become relevant. |
| 2026-03-26 | `wcag-audit-patterns` | deferred | Still viable as a later comparison pass against Lamella's existing accessibility coverage rather than a current import candidate. |
| 2026-03-26 | `workshop-facilitation` | deferred | Still viable as meta-facilitation support if Lamella adds a dedicated workshops category. |

## Rejected

| Date | Candidate | Status | Notes |
|------|-----------|--------|-------|
| 2026-03-26 | `agent-designer` | rejected | Overlaps too heavily with Lamella's existing agent-development and multi-agent authoring stack. |
| 2026-03-26 | `agenthub` | rejected | Too close to Lamella's current agent, workflow, and worktree orchestration coverage to justify a separate import. |
| 2026-03-26 | `angular` | rejected | Explicitly dropped from the backlog. We are not planning Angular-specific imports. |
| 2026-03-26 | `angular-best-practices` | rejected | Explicitly dropped from the backlog alongside the other Angular-specific candidates. |
| 2026-03-26 | `angular-migration` | rejected | Explicitly dropped from the backlog alongside the other Angular-specific candidates. |
| 2026-03-26 | `brainstorming` | rejected | Redundant with Lamella's existing brainstorming and planning workflows. |
| 2026-03-26 | `browser-automation` | rejected | Redundant with Lamella's current browser automation and Playwright coverage. |
| 2026-03-26 | `docker-development` | rejected | Redundant with Lamella's existing Docker and devops plugin coverage. |
| 2026-03-26 | `helm-chart-builder` | rejected | Redundant with Lamella's existing Helm and Kubernetes coverage. |
| 2026-03-26 | `jobs-to-be-done` | rejected | Redundant with Lamella's existing JTBD canvas and adjacent product-discovery skills. |
| 2026-03-26 | `matt-skills` | rejected | Source-set label only, not a standalone skill candidate; logged here so the candidate accounting stays complete. |
| 2026-03-26 | `opportunity-solution-tree` | rejected | Redundant with Lamella's current opportunity-tree coverage. |
| 2026-03-26 | `playwright-pro` | rejected | Redundant with Lamella's existing Playwright and E2E testing skills. |
| 2026-03-26 | `pr-review-expert` | rejected | Redundant with Lamella's current code review and review-process skills. |
| 2026-03-26 | `prd-development` | rejected | Redundant with Lamella's existing PRD and product-specification workflows. |
| 2026-03-26 | `problem-statement` | rejected | Redundant with Lamella's existing problem-statement skill. |
| 2026-03-26 | `rag-architect` | rejected | Redundant with Lamella's current RAG plugin and retrieval-system skills. |
| 2026-03-26 | `senior-backend` | rejected | Too generic and persona-shaped relative to Lamella's existing backend and API skills. |
| 2026-03-26 | `senior-devops` | rejected | Too generic and redundant with Lamella's existing devops coverage. |
| 2026-03-26 | `senior-frontend` | rejected | Too generic and redundant with Lamella's existing frontend coverage. |
| 2026-03-26 | `senior-security` | rejected | Too generic and redundant with Lamella's existing security coverage. |
| 2026-03-26 | `tdd` | rejected | Redundant with Lamella's existing TDD coverage. |
| 2026-03-26 | `tdd-guide` | rejected | Redundant with Lamella's existing TDD and test-writing coverage. |
| 2026-03-26 | `write-a-skill` | rejected | Redundant with Lamella's existing skill-authoring coverage. |
| 2026-03-26 | `user-story` | rejected | Redundant with Lamella's existing user-story coverage. |
| 2026-03-26 | `using-superpowers` | rejected | Too repo-specific and not a portable Lamella capability. |
| 2026-03-26 | `writing-skills` | rejected | Too overlapping with Lamella's existing writing and skill-authoring guidance. |
| 2026-03-26 | `obsidian-vault` | rejected | Hardcoded local vault path and redundant with Lamella's existing Obsidian skill. |
| 2026-03-26 | `scaffold-exercises` | rejected | Repo-specific directory and lint workflow. |
| 2026-03-26 | `migrate-to-shoehorn` | rejected | Too narrow and ecosystem-specific. |
| 2026-03-26 | `edit-article` | rejected | Too thin relative to Lamella's current writing stack. |
| 2026-03-26 | `office-productivity` | rejected | Too broad and generic to justify a Lamella import, and it did not contain reusable scripts or references that materially improved the existing document and spreadsheet tool stack. |
| 2026-03-26 | `proto-persona` | rejected | Overlaps too heavily with Lamella's JTBD, problem-framing, and interview-synthesis skills, while relying on weaker demographic and assumption-heavy persona scaffolding. |
