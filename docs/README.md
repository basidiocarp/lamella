# Lamella

Lamella is a portable resource system for AI coding environments with
first-class Claude plugin builds and Codex skill exports.

It is a packaging repo, not a runtime manager. Author in `resources/` and
`manifests/`, validate and build from there, and treat `dist/` as disposable
output.

The current library ships **286 curated skills** across **52 plugins**, plus
shared agents, commands, hooks, workflows, and templates that are bundled into
installable outputs.

## What Lamella Provides

Lamella builds Claude Code plugins in the official plugin format, produces a
local Claude marketplace under `dist/claude/`, and exports Codex skills under
`dist/codex/`. Packaging is manifest-driven and covers skills, agents, commands,
hooks, and standalone resources. Build tooling validates source files, manifests,
cross-file references, and built output.

Runtime install policy and repair flows stay outside Lamella. Those belong to
the ecosystem manager, even when it calls Lamella presets or install surfaces.

## Plugin Families

Lamella uses a layered plugin model. Broad umbrella bundles still exist for
compatibility, and several large domains expose narrower capability plugins
as well.

| Family | Broad Bundle | Layered Plugins |
|--------|--------|-------------|
| Core | `core` | `core-base`, `core-quality`, `core-architecture`, `core-operations` |
| Security | `security` | `security-base`, `security-scanning`, `security-fuzzing`, `security-crypto`, `security-compliance` |
| DevOps | `devops` | `devops-cloud`, `devops-platform`, `devops-kubernetes`, `devops-observability` |
| Tools | `tools` | `tools-cli`, `tools-browser`, `tools-documents`, `tools-diagrams`, `tools-integration` |
| Meta | `meta` | `meta-authoring`, `meta-governance`, `meta-routing` |
| Frontend | `frontend` | `frontend-base`, `frontend-visual`, `frontend-3d` |
| Workflow | `workflow` | `workflow-planning`, `workflow-git`, `workflow-execution` |
| Stable Single-Bundle Domains | `agile-pm`, `ai-agents`, `atmos`, `collaboration`, `cpp`, `customer-insights`, `database`, `developer-ops`, `enterprise-it`, `executive`, `go`, `go-to-market`, `microservices`, `python`, `rag`, `rust`, `typescript`, `writing` | No layered split yet |

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

## Start Here

| Section | Description |
|---------|-------------|
| [Getting Started](getting-started/README.md) | Installation, first skill, and onboarding flow |
| [Authoring](authoring/best-practices.md) | Skill and agent authoring guidance |
| [Reference](reference/README.md) | Claude and Codex reference snapshots with Lamella-specific pointers |

## Project Docs

| Section | Description |
|---------|-------------|
| [Architecture](architecture.md) | Build pipeline, packaging model, and validation flow |
| [Roadmap](roadmap.md) | Current priorities and shipped milestones |
| [Maintainers](maintainers/README.md) | Maintainer-facing docs for inventory, feedback capture, and boundary cleanup |

## Planning and Migration

| Section | Description |
|---------|-------------|
| [Plans](plans/README.md) | Active Lamella planning documents |
| [Migrations](migrations/README.md) | Claude skill import and migration records |

## Canonical vs Historical

Treat the docs above as Lamella's maintained surface. In practice, that means:

- `getting-started/`, `authoring/`, and `reference/` are the live operator and authoring paths
- `architecture.md`, `roadmap.md`, and `maintainers/` hold current project guidance
- imported snapshots under `reference/` are maintained only where Lamella adds packaging or host-specific context
