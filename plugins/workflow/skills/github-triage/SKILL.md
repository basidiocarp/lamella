---
name: github-triage
description: "Batch-triages GitHub issues and PRs with read-only analysis and permalink-backed verdicts."
argument-hint: "Issue/PR number or search query (e.g., 'is:issue label:bug')"
origin: lamella
---

# Read-Only GitHub Triage

Triage a batch of GitHub issues or pull requests with structured read-only analysis. Every verdict is backed by permalinks to its evidence source.

## Core Workflow

1. Detect input — issue list, PR list, or search query
2. Fetch each item using `gh` (read-only: `gh issue list`, `gh pr list`, `gh search`, `gh api GET`)
3. Fan each item out to a per-item canopy task
4. Apply triage templates from `references/`
5. Produce a triage report where every verdict cites its source

## Required Templates

- **bug-classifier** — classify as bug/feature/question/invalid, permalink-backed
- **duplicate-detector** — find probable duplicates, each candidate linked by permalink
- **already-fixed-verifier** — determine if the bug is fixed; cite the fixing commit permalink
- **severity-rater** — rate severity (critical/high/medium/low) with evidence permalink
- **label-suggester** — suggest labels (read-only; never apply); each justified by permalink
- **pr-analysis** — analyze open PR scope, risk, and linked issues, all permalink-backed

## Gotchas

- **Zero mutation** — the skill performs NO GitHub state changes. No `gh issue edit`, `gh pr edit`, no labels, comments, or merges. Read-only `gh` only.
- **Permalink evidence** — every triage claim must cite a permalink (issue/PR/commit/code line). The verdict is only valid if the evidence is linked.
- **ALREADY_FIXED fix trace** — when the verdict is ALREADY_FIXED, cite the commit (permalink) that fixed the issue, not a bare assertion.
