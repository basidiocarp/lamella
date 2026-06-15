# Skill Taxonomy

Guidelines for classifying skills, handling licensing, and maintaining
confidentiality safeguards.

## Open-Source Skills

Skills intended for public sharing. They must be:

- **Client-agnostic** — no references to specific clients, internal systems,
  or proprietary APIs
- **Methodology-driven** — focus on techniques and patterns, not
  implementation details tied to a particular codebase
- **Properly attributed** — include author and origin information

### Author Attribution Template

```yaml
---
name: skill-name
version: "1.0.0"
author: "Author Name"
author_url: "https://example.com"
licence: "CC BY 4.0"
origin: "Brief description of where this skill came from"
---
```

### Licensing

CC BY 4.0 is the recommended default for open-source skills:

- Allows commercial use, adaptation, and redistribution
- Requires attribution to the original author
- Compatible with most open-source workflows

Include a `licence` field in the frontmatter. If a skill draws from multiple
sources, note the most restrictive licence that applies.

### Feedback Pathway

Open-source skills should include a way for users to report issues or suggest
improvements — a GitHub Issues link, email, or discussion forum reference.

## Internal Skills

Skills that encode organisation-specific knowledge:

- **Client-specific** — may reference internal systems, APIs, or workflows
- **Proprietary** — not intended for public distribution
- **No special attribution requirements** beyond internal documentation norms

## Confidentiality Safeguards

Four layers prevent private information from leaking into skills:

### Layer 1 — Observation-Level Stripping

When logging an observation, scrub it of client names, project names, internal
URLs, API keys, and any other identifying information before writing to the
log. Replace with generic labels: `[client]`, `[project]`, `[internal-url]`.

### Layer 2 — Pre-Creation Review

Before drafting a new skill from observations, review all source observations
and verify no confidential information remains. Flag anything ambiguous.

### Layer 3 — Post-Draft Sweep

After writing a skill draft, perform a final scan for:

- Hardcoded values that look like real data
- URLs pointing to internal systems
- Names of real people, companies, or projects (unless they are public and
  relevant — e.g., referencing a public open-source project)
- API endpoints or authentication patterns that reveal infrastructure

### Layer 4 — Structural Principle

Skills should describe **what to do and why**, not **how a specific client
does it**. If a skill can only be understood in the context of a particular
organisation's setup, it is an internal skill, not a public one.
