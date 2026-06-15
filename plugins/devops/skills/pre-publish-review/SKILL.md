---
name: pre-publish-review
description: "Layered pre-publish gate for Rust crates: deep-dive per-change review, holistic API and supply-chain analysis, and synthesis verdict before cargo publish."
origin: lamella
---

# Pre-Publish Review

Use this skill as a layered multi-agent review gate for Rust crates in the basidiocarp ecosystem, running after `release-manager` has set the version and changelog but before `cargo publish`. It enforces three-layer verification: per-change deep-dive, holistic API/supply-chain review, and final synthesis. The agent count scales with the diff — Layer 1 spawns one agent per logical change unit, plus two holistic agents and one synthesis agent.

This skill is Rust/Cargo-only: the publish gate command is `cargo publish --dry-run`. It replaces the npm-specific commands (`npm publish --dry-run`, `npm pack`) from the pattern it was adapted from — do not substitute a Node package-manager publish command.

## When to Use

Run this skill in a pre-publish release gate for Rust crates in the basidiocarp workspace after the `release-manager` skill has finalized version and changelog. Do not run until version bumps and changelog updates are committed. The skill blocks or clears the crate for `cargo publish`.

## Workflow

The three-layer structure is explicit; do not collapse layers into one phase:

### Layer 1 — Per-Change Deep-Dive Agents

Spawn N agents (one per logical change unit: per crate or per module boundary in the diff). Each agent:

1. Runs `cargo test` to confirm all tests pass in the changed code.
2. Runs `cargo clippy -- -D warnings` to catch lints in the changed scope.
3. Runs `cargo publish --dry-run` to verify the crate publishes structurally (manifest valid, all dependencies resolvable).
4. Performs a focused correctness review of the diff, paying special attention to unsafe code, public API changes, and behavioral invariants.
5. Emits exactly one verdict: BLOCK, RISKY, CAUTION, or SAFE, with written rationale.

Create one task per agent via `canopy task create` and let them run in parallel.

### Layer 2 — Holistic Review Agents

Spawn two agents. Both receive the full diff and all Layer 1 verdicts:

**Agent A (API Surface Stability):** Reviews the full diff for semver breakage, public type changes, visibility changes, and trait implementation changes. Checks for documented deprecation periods if removing public symbols. Emits one verdict: BLOCK, RISKY, CAUTION, or SAFE.

**Agent B (Dependency Supply-Chain Risk):** Reviews all new dependencies added in the diff (check `Cargo.toml` diff), their versions, yanked-version history, and maintenance status. Flags transitive dependencies pulled in by new direct deps. Emits one verdict: BLOCK, RISKY, CAUTION, or SAFE.

### Layer 3 — Synthesis Agent

Receive all verdicts from Layers 1 and 2. Aggregate them using this rule:

- ANY BLOCK from ANY layer → final BLOCK (the synthesis agent has NO discretion to override a BLOCK verdict).
- Majority RISKY (> 50% of verdicts) → RISKY.
- Otherwise → CAUTION or SAFE.

Output the final verdict with a summary of all Layer 1 and 2 rationales and the aggregation decision.

## Verdict Taxonomy

Every agent output maps to exactly one verdict before synthesis:

- **BLOCK**: A change introduces a runtime correctness bug, a security vulnerability, a yanked dependency, or a permanent semver breakage with no deprecation period. Publication must not proceed.
- **RISKY**: A change has uncertain correctness (complex logic not fully covered by added tests), an unsafe block without documented invariants, or a semver violation that can be recovered if quickly patched. Publication should not proceed without additional review or correction.
- **CAUTION**: A change is correct but touches sensitive code (allocation, concurrency, API surface), adds a new dependency with known security advisories (but not yet yanked), or makes a normal API change without full deprecation documentation. Publication can proceed but watch for reports; have a hotfix plan.
- **SAFE**: The change is correct, well-tested, and poses no known risk.

## Handoff Pointers

**Prerequisite:** The `release-manager` skill must run before this skill. It handles version bumping, changelog generation, and readiness assessment. Do not duplicate changelog or version-bump logic here.

**Workspace context:** See the root `CLAUDE.md` for CI gate rules, test strategy, and the definition of green CI before committing. This skill uses the same Rust verification gates (tests, clippy, publish-dry-run).

**Parallel dispatch:** Use `canopy task create` to spawn all Layer 1 agents in parallel (disjoint per-crate or per-module scopes ensure no write conflicts). Layer 2 agents can run in parallel with each other once Layer 1 output is available. Layer 3 runs after both Layer 1 and 2 are complete.

## Non-Goals

This skill does not bump versions, write changelogs, derive semver recommendations, or tag releases — those are the responsibility of the `release-manager` skill and must be completed first.

This skill does not collapse the three review layers into a single phase. The layering ensures correctness (deep dives catch bugs), consistency (holistic agents prevent semver violations and supply-chain surprises), and final aggregation (synthesis prevents a single dissenting agent from overriding a clear BLOCK).

This skill is Rust/Cargo-oriented. The gate command is `cargo publish --dry-run` (not npm or other package managers).
