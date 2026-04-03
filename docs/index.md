# Lamella

Lamella is a portable resource system for AI coding environments with
first-class Claude plugin builds and Codex skill exports.

The current library ships **286 curated skills** across **52 plugins**, plus
shared agents, commands, hooks, workflows, and templates that are bundled into
installable outputs.

## What Lamella Provides

Lamella builds Claude Code plugins in the official plugin format, produces a
local Claude marketplace under `dist/claude/`, and exports Codex skills under
`dist/codex/`. Packaging is manifest-driven and covers skills, agents, commands,
hooks, and standalone resources. Build tooling validates source files, manifests,
cross-file references, and built output.

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

## Documentation

| Section | Description |
|---------|-------------|
| [Getting Started](getting-started/index.md) | Installation, first skill, and onboarding flow |
| [Authoring](authoring/best-practices.md) | Skill and agent authoring guidance |
| [Reference](reference/plugins.md) | Claude Code reference snapshots plus Lamella-specific marketplace and packaging context |
| [Architecture](architecture.md) | Build pipeline, packaging model, and validation flow |
| [Roadmap](roadmap.md) | Current priorities and shipped milestones |
| [Plugin Layering Migration Plan](plans/plugin-layering-migration.md) | Proposed plugin split, naming, and rollout plan for narrower bundles |
| [Tool Cleanup Plan](tool-boundary-cleanup.md) | Per-file keep, migrate, retire, and sequencing decisions for Lamella tooling |
