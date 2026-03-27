# Lamella

Lamella is a portable resource system for AI coding environments with
first-class Claude plugin builds and Codex skill exports.

The current library ships **286 curated skills** across **25 plugins**, plus
shared agents, commands, hooks, workflows, and templates that are bundled into
installable outputs.

## What Lamella Provides

- Claude Code plugins built in the official plugin format.
- A local Claude marketplace under `dist/claude/`.
- Codex skill exports under `dist/codex/`.
- Manifest-driven packaging for skills, agents, commands, hooks, and standalone
  resources.
- Validation and build tooling that checks source files, manifests, cross-file
  references, and built output.

## Plugin Catalog

| Plugin | Skills | Description |
|--------|--------|-------------|
| **devops** | 24 | Docker, Kubernetes, Terraform, AWS, CI/CD, and deployment patterns |
| **developer-ops** | 5 | Incident command, release management, runbooks, tech debt tracking, and spec-driven execution |
| **security** | 26 | Vulnerability scanning, threat modeling, fuzzing, auditing, and secure coding practices |
| **core** | 32 | Coding standards, testing, git workflow, debugging, and code review |
| **tools** | 28 | CLI tools, shell and PowerShell scripting, analytics, MCP integration, and productivity utilities |
| **atmos** | 20 | Cloud Posse Atmos stack orchestration |
| **meta** | 17 | Framework internals, skill management, and plugin utilities |
| **workflow** | 14 | Planning, git operations, decision records, and project workflows |
| **ai-agents** | 9 | Multi-agent patterns, LLM evaluation, and agent tooling |
| **python** | 10 | Django, FastAPI, async patterns, testing, and modern Python practices |
| **collaboration** | 7 | Team facilitation, debate, project continuity, and expert synthesis |
| **typescript** | 9 | React, Next.js, Node.js patterns, and frontend architecture |
| **rust** | 11 | Ownership, concurrency, unsafe review, and idiomatic Rust practices |
| **microservices** | 4 | Event sourcing, sagas, CQRS, and distributed systems |
| **agile-pm** | 10 | Product planning and delivery artifacts |
| **customer-insights** | 9 | JTBD, interview planning, market analysis, journey mapping, competitive analysis, and shared language |
| **executive** | 11 | Board updates, operating rhythms, executive coaching, and scenario planning |
| **go-to-market** | 6 | Pricing, launch content, press releases, content strategy, and email programs |
| **enterprise-it** | 5 | Atlassian, Confluence, Jira, Google Workspace, and Microsoft 365 operations |
| **frontend** | 11 | Accessibility, design systems, responsive layouts, performance, and UI generation |
| **go** | 2 | Concurrency patterns, testing, and idiomatic Go |
| **cpp** | 3 | Modern C++, testing, and embedded systems patterns |
| **database** | 3 | Schema design, PostgreSQL, SQL optimization, and query tuning |
| **rag** | 4 | Embeddings, hybrid search, vector optimization, and RAG architecture |
| **writing** | 6 | Documentation, voice, style, changelogs, and poster workflows |

## Quick Start

```bash
# Build the Claude marketplace
./lamella build-marketplace

# Install Claude plugins in dependency order
./lamella install core python typescript

# Build Codex exports
./lamella build-codex

# Install Codex skills
./lamella install-codex --all
```

## Documentation

| Section | Description |
|---------|-------------|
| [Getting Started](getting-started/index.md) | Installation, first skill, and onboarding flow |
| [Authoring](authoring/best-practices.md) | Skill and agent authoring guidance |
| [Reference](reference/plugins.md) | Claude Code reference snapshots plus Lamella-specific marketplace and packaging context |
| [Architecture](architecture.md) | Build pipeline, packaging model, and validation flow |
| [Roadmap](roadmap.md) | Current priorities and shipped milestones |
