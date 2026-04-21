---
name: rust-docs-quality
description: Write and review Rust documentation and lint policy with the right level of strictness. Use when improving rustdoc, documenting public contracts, deciding lint severity, or aligning docs and tooling with crate quality goals.
origin: lamella
---

# Rust Docs Quality

Use this skill when the work is about how the crate explains itself and how
tooling enforces that quality.

## Focus Areas

- public API documentation
- rustdoc sections and intra-doc links
- lint policy and severity
- package metadata and crate presentation

## Workflow

1. Decide whether the crate is internal, reusable, or published.
2. Document caller-facing behavior before implementation details.
3. Centralize lint policy and only enforce what the repo can realistically keep green.
4. Keep docs, manifests, and examples aligned.

## References

- load [references/docs-quality.md](./references/docs-quality.md) for rustdoc and lint guidance
