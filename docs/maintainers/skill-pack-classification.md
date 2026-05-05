# Skill Pack Classification

This document classifies lamella's skill library into general and ecosystem-specific categories.

## Classification Rules

Skills are classified based on their dependencies and whether they assume basidiocarp-specific tooling:

- **general**: Reusable without basidiocarp repos, tools, or conventions. Does not reference hyphae, mycelium, cortina, canopy, rhizome, stipe, lamella, spore, annulus, hymenium, volva, septa, .handoffs/, HANDOFFS.md, or ecosystem-versions.toml.

- **basidiocarp**: Depends on basidiocarp-specific tools, repos, contracts, or conventions. References one or more of: hyphae, mycelium, cortina, canopy, rhizome, stipe, lamella, spore, annulus, hymenium, volva, septa/, .handoffs/, HANDOFFS.md, ecosystem-versions.toml, or other basidiocarp-specific file paths or workflows.

- **adapter-candidate**: Core guidance is general-purpose; examples, references, or thin integrations are basidiocarp-specific. Can be split into a general base skill plus a thin basidiocarp companion skill.

## Category Classifications

### agile-pm/

- Classification: **general**
- All skills in this category are general project management and planning guidance with no ecosystem dependencies.

### ai-agents/

- Classification: **general**
- Covers agent design patterns and reasoning techniques independent of any specific tool or ecosystem.

### atmos/

- Classification: **general**
- Atmospheric and environmental context for long-running tasks; no ecosystem dependencies.

### collaboration/

- Classification: **general**
- Team communication, async work, and collaboration patterns; no ecosystem dependencies.

### core/

- Classification: **mixed**
- **General**: api-test-suite-builder, agent-introspection-debugging, architecture-decision-records, brainstorming, clarify-requirements, code-maturity-assessor, code-review-pro, code-review-process, continuous-learning, codebase-onboarding, dependency-upgrade, deep-module-review, design-patterns, duplicate-detection, e2e-testing, fidelity-review, git-cleanup, interface-design-variants, legacy-modernizer, monorepo-management, parallel-debugging, plan-fleet, property-based-testing, structured-review, systematic-debugging, tech-debt-tracker, test-debugging, test-driven-development, test-writing, type-driven-design, verified-implementer
- **basidiocarp**: council (references hyphae and basidiocarp roles), error-memory (stores to hyphae), memoir-concept-extraction (uses hyphae memoir tools), strategic-compact (references annulus statusline for context monitoring)
- **adapter-candidate**: context-engineering (core is general; mentions hyphae enrichment as optional), token-efficiency (core is general; references annulus statusline for session tracking)

### council-roles/

- Classification: **basidiocarp**
- All skills reference basidiocarp ecosystem roles (contributors, maintainers, operators).

### cpp/

- Classification: **general**
- C++ language-specific guidance with no ecosystem dependencies.

### database/

- Classification: **general**
- Database design and migration patterns independent of any ecosystem.

### devops/

- Classification: **general**
- DevOps tooling, deployment, monitoring, and infrastructure patterns; general-purpose guidance.

### frontend/

- Classification: **general**
- Frontend frameworks, UI patterns, and component design; general-purpose guidance.

### go/

- Classification: **general**
- Go language-specific guidance with no ecosystem dependencies.

### meta/

- Classification: **mixed**
- **General**: agent-development, command-development, config-curator, create-hook, create-skill, create-workflow-command, designing-workflow-skills, evolve-skill, file-todos, plugin-settings, plugin-structure, rust-crate-skill-generator, skill-best-practices, skill-composer-studio, skill-router, skill-stocktake, task-observer, team-communication-protocols (meta skills for authoring and plugin management)
- **basidiocarp**: create-handoff (references .handoffs/, HANDOFFS.md, and basidiocarp project names)

### microservices/

- Classification: **general**
- Microservice architecture patterns and deployment strategies; no ecosystem dependencies.

### python/

- Classification: **general**
- Python language-specific guidance with no ecosystem dependencies.

### rag/

- Classification: **adapter-candidate**
- Core RAG patterns and vector search are general. However, several skills reference hyphae integration (hyphae_search_docs, hyphae document ingestion). Split potential: general RAG core + hyphae companion for integration.

### rust/

- Classification: **general**
- Rust language-specific guidance. No ecosystem dependencies (spore is a library consumed but not required for the skills themselves).

### security/

- Classification: **general**
- Security patterns, threat modeling, and best practices; general-purpose guidance.

### tools/

- Classification: **mixed**
- **General**: Most skills (grep, jq, curl, sed patterns, etc.) are tool-independent
- **basidiocarp**: Any tool skill that references mycelium, rhizome, or spore CLIs

### typescript/

- Classification: **general**
- TypeScript language-specific guidance with no ecosystem dependencies.

### workflow/

- Classification: **mixed**
- **General**: Many workflow skills are general: creating-code-review-checklist, executing-plans, git-analyze-issue, git-create-pr, git-worktrees, kaizen, shipping-safely, etc.
- **basidiocarp**: capture-observation (writes to .notes/, references ecosystem observation format), create-plans (references basidiocarp planning fixtures), deliver-edge-cases (references ecosystem handoff structures), handoff-check (audits .handoffs/ files and HANDOFFS.md), context-handoff (uses .handoffs/ format), conductor (orchestrates basidiocarp handoffs), compound-scenario-planning (references ecosystem), develop-adr (references ecosystem ADR conventions), develop-spike-summary (ecosystem spike format), finishing-a-development-branch (references ecosystem handoff/observation patterns)

### writing/

- Classification: **general**
- Writing, documentation, and communication guidance; no ecosystem dependencies.

## Basidiocarp-Specific Skills

These skills require basidiocarp ecosystem tools, repos, or conventions:

**core/**
- council
- error-memory
- memoir-concept-extraction
- strategic-compact

**council-roles/**
- All skills (basidiocarp-specific roles)

**meta/**
- create-handoff

**workflow/**
- capture-observation
- conductor
- compound-scenario-planning
- context-handoff
- create-plans
- deliver-edge-cases
- develop-adr
- develop-spike-summary
- finishing-a-development-branch
- handoff-check

## Adapter-Candidate Skills

These skills have general cores with basidiocarp-specific examples or integrations:

**core/**
- context-engineering (general context principles; hyphae enrichment is an optional ecosystem example)
- token-efficiency (general token strategies; references annulus statusline for session tracking)

**rag/**
- Any RAG skill that integrates with hyphae (memorial ingestion, hyphae_search_docs)

## General Skills

All remaining skills in the following categories are general-purpose and reusable without basidiocarp ecosystem dependencies:

- agile-pm/
- ai-agents/
- atmos/
- collaboration/
- cpp/
- database/
- devops/
- frontend/
- go/
- microservices/
- python/
- rust/
- security/
- typescript/
- writing/

And the following in mixed categories:

**core/**: api-test-suite-builder, agent-introspection-debugging, architecture-decision-records, brainstorming, clarify-requirements, code-maturity-assessor, code-review-pro, code-review-process, continuous-learning, codebase-onboarding, dependency-upgrade, deep-module-review, design-patterns, duplicate-detection, e2e-testing, fidelity-review, git-cleanup, interface-design-variants, legacy-modernizer, monorepo-management, parallel-debugging, plan-fleet, property-based-testing, structured-review, systematic-debugging, tech-debt-tracker, test-debugging, test-driven-development, test-writing, verified-implementer

**meta/**: agent-development, command-development, config-curator, create-hook, create-skill, create-workflow-command, designing-workflow-skills, evolve-skill, file-todos, plugin-settings, plugin-structure, rust-crate-skill-generator, skill-best-practices, skill-composer-studio, skill-router, skill-stocktake, task-observer, team-communication-protocols

**tools/**: Most tool skills (except those referencing mycelium, rhizome, or spore CLIs)

**workflow/**: creating-code-review-checklist, executing-plans, git-analyze-issue, git-create-pr, git-worktrees, kaizen, shipping-safely, and others without .handoffs/, basidiocarp repo, or ecosystem fixture references
