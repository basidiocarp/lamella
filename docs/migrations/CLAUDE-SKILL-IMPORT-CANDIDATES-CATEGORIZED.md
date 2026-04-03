# Claude Skill Import Candidates: Proposed Categories

This document reorganizes the three import lists in `docs/` into a cleaner taxonomy.

It is not constrained to Lamella's current plugin layout. In several places, the cleaner answer is to introduce a new category instead of forcing a skill into an awkward existing plugin.

## Current Lamella Status

As of the 2026-03-26 category pass in `lamella`, these categories now exist as real Lamella plugins:

- `customer-insights`
- `executive`
- `go-to-market`
- `enterprise-it`
- `developer-ops`

These categories are still only proposals and were deliberately left deferred:

- `workshops`
- `creative`
- `developer-experience`
- `platform-engineering`
- `domain-modeling`
- `data-and-analytics`
- `compliance`
- `frontend-motion`

## Recommended New Top-Level Categories

These are the categories I would seriously consider adding, even if Lamella does not have them today.

- `executive`
  Leadership, staff, management operating system, and executive communication skills.
- `go-to-market`
  Product marketing, launch, pricing, content, acquisition, and campaign support.
- `customer-insights`
  Discovery, personas, journey mapping, user research, and competitive analysis.
- `workshops`
  Facilitation-heavy, multi-turn, interactive working sessions.
- `creative`
  Visual exploration, themes, motion, image generation, generative art, and delight-heavy outputs.
- `enterprise-it`
  Jira, Confluence, Google Workspace, Microsoft 365, and internal admin workflows.
- `developer-experience`
  Local development environment setup, repo onboarding, commit-time guardrails, and day-to-day developer ergonomics.
- `developer-ops`
  Release, runbooks, incident handling, codebase onboarding, tech debt, and repo maintenance.
- `platform-engineering`
  MCP servers, observability, schema design, integration testing, platform tooling.
- `domain-modeling`
  Canonical terminology, bounded contexts, and shared language artifacts that sharpen system design and product communication.
- `data-and-analytics`
  Data pipelines, analytics instrumentation, metrics, experimentation, and data storytelling.
- `compliance`
  Audit-readiness, control mapping, and non-implementation governance work.
- `frontend-motion`
  A narrower category for motion, 3D, and highly visual frontend work if you do not want all of that to live under `frontend`.

## Category Map

## Executive

These are the clearest exec-style imports.

- `board-deck-builder`
- `chief-of-staff`
- `company-os`
- `change-management`
- `culture-architect`
- `org-health-diagnostic`
- `scenario-war-room`
- `strategic-alignment`
- `director-readiness-advisor`
- `vp-cpo-readiness-advisor`
- `executive-onboarding-playbook`

## Customer Insights

These are discovery and research oriented rather than execution oriented.

- `company-research`
- `customer-journey-map`
- `customer-journey-mapping-workshop`
- `discovery-interview-prep`
- `proto-persona`
- `ubiquitous-language`
  Note: this could justify a dedicated `domain-modeling` bucket if more similar skills are imported later.
- `competitive-intel`
- `competitive-landscape`
- `jobs-to-be-done`
  Note: already marked as lower priority because of Lamella overlap.
- `pestel-analysis`
- `tam-sam-som-calculator`

## Product Strategy

These are product framing and decision-support skills.

- `feature-investment-advisor`
- `finance-based-pricing-advisor`
- `business-health-diagnostic`
- `product-strategy-session`
- `roadmap-planning`
- `problem-statement`
  Note: overlap candidate, not a priority import.
- `opportunity-solution-tree`
  Note: overlap candidate, not a priority import.
- `product-manager-toolkit`
  Source note: appears in the Antigravity review-later bucket and is still broad enough that it may be better as a meta-category than a direct import.

## Go-To-Market

These are launch, pricing, marketing, and growth skills.

- `acquisition-channel-advisor`
- `positioning-statement`
- `press-release`
- `launch-strategy`
- `pricing-strategy`
- `marketing-strategy-pmm`
- `content-strategy`
- `copy-editing`
- `copywriting`
- `email-sequence`
- `social-content`
- `social-media-manager`
- `ad-creative`
- `campaign-analytics`
- `brand-guidelines`

## Workshops

These are best thought of as facilitation tools, not just static references.

- `customer-journey-mapping-workshop`
- `positioning-workshop`
- `lean-ux-canvas`
- `workshop-facilitation`
- `discovery-process`
- `scrum-master`
- `grill-me`
- `brainstorming`
  Note: strong overlap with Lamella's existing brainstorming workflow.

## Creative

These are the strongest delight-oriented additions.

- `design-spells`
- `theme-factory`
- `algorithmic-art`
- `ai-studio-image`
- `stability-ai`
- `image-studio`
- `screenshots`
- `slack-gif-creator`
- `storyboard`
- `vizcom`
- `viral-generator-builder`
- `magic-ui-generator`

## Frontend Motion

These are specialized visual and motion-driven frontend skills. I would keep them separate from generic frontend skills if you import more than a couple.

- `3d-web-experience`
- `spline-3d-integration`
- `animejs-animation`
- `threejs-animation`
- `threejs-postprocessing`
- `threejs-shaders`
- `scroll-experience`
- `stitch-ui-design`
- `ui-visual-validator`

## Developer Experience

These are teammate-facing engineering workflow skills focused on day-to-day setup and ergonomics.

- `codebase-onboarding`
- `monorepo-navigator`
- `setup-pre-commit`

## Developer Ops

These are the most operationally useful developer-facing imports.

- `incident-commander`
- `release-manager`
- `runbook-generator`
- `tech-debt-tracker`
- `dependency-auditor`
- `skill-tester`
- `spec-driven-workflow`

## Platform Engineering

These are implementation and platform-support skills rather than general app-dev skills.

- `design-an-interface`
- `mcp-server-builder`
- `api-test-suite-builder`
- `database-schema-designer`
- `observability-designer`
- `algolia-search`
- `api-testing-observability-api-mock`
- `appdeploy`
- `stripe-integration-expert`
- `improve-codebase-architecture`

## Enterprise IT

These are teammate-facing admin and systems-operation skills that do not belong in the product or engineering buckets.

- `atlassian-admin`
- `jira-expert`
- `confluence-expert`
- `google-workspace-cli`
- `ms365-tenant-manager`
- `office-productivity`

## Data and Analytics

These are best grouped separately if you plan to support analysts, data engineers, or metrics-heavy PM work.

- `analytics-tracking`
- `financial-analyst`
- `saas-metrics-coach`
- `senior-data-engineer`
- `senior-data-scientist`
- `airflow-dag-patterns`
- `data-storytelling`

## Compliance

This should probably be its own bucket rather than being folded into `security`.

- `soc2-compliance`

## Framework and Ecosystem Gaps

These are category candidates only if you want framework-specific expansion.

- `astro`
- `android-jetpack-compose-expert`
- `async-python-patterns`
- `aws-solution-architect`
- `azure-cloud-architect`
- `gcp-cloud-architect`

## Recommended Grouping Strategy

If you want the cleanest medium-term structure, I would group imports into these plugin or category families:

1. `executive`
2. `customer-insights`
3. `go-to-market`
4. `creative`
5. `workshops`
6. `enterprise-it`
7. `developer-experience`
8. `developer-ops`
9. `platform-engineering`
10. `data-and-analytics`
11. `compliance`

I would only add `frontend-motion` as its own category if you import at least three of the 3D or motion-heavy skills. Otherwise those can live inside `creative` or `frontend`.

I would only add `domain-modeling` as a standalone category if you import `ubiquitous-language` and at least one or two more DDD-oriented glossary or bounded-context skills. Otherwise it can live under `customer-insights` or `core`.

## Exec-Style Skills

Yes. The earlier docs do include exec-style skills.

The clearest ones are:

- `board-deck-builder`
- `chief-of-staff`
- `company-os`
- `change-management`
- `culture-architect`
- `org-health-diagnostic`
- `scenario-war-room`
- `strategic-alignment`
- `director-readiness-advisor`
- `vp-cpo-readiness-advisor`
- `executive-onboarding-playbook`

If you want a dedicated leadership or staff-facing plugin, there is enough material to justify one.
