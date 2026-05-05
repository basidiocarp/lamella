# Manifests

This directory contains Claude plugin and Codex export manifests that define skill packages and their dependencies.

## Skill Pack Classification

Manifests reference skills from two categories:

### general

Skills classified as **general** are reusable without basidiocarp ecosystem dependencies. They work in any codebase or environment independent of tools like hyphae, mycelium, cortina, annulus, or basidiocarp-specific conventions (.handoffs/, HANDOFFS.md, ecosystem-versions.toml).

**Examples:** test-driven-development, code-review-pro, architecture-decision-records, git-cleanup

### basidiocarp

Skills classified as **basidiocarp** assume the basidiocarp ecosystem is installed and available. They reference basidiocarp tools (hyphae, mycelium, cortina, canopy, rhizome, stipe, lamella, spore, annulus, hymenium, volva), ecosystem conventions (septa/, .handoffs/, HANDOFFS.md), or basidiocarp-specific workflows.

**Examples:** handoff-check, create-handoff, capture-observation, error-memory, memoir-concept-extraction, strategic-compact

## Manifest Organization

- `claude/`: Manifests for Claude plugin packaging
- `codex/`: Manifests for Codex export packaging

For a detailed skill classification inventory, see `docs/maintainers/skill-pack-classification.md`.
