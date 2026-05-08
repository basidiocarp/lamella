---
name: architecture-decision-records
description: "Run this when making or documenting architectural decisions — produces ADRs with clear rationale, alternatives, and trade-offs."
origin: lamella
---
# Architecture Decision Records


## Contents

- [When to Use](#when-to-use)
- [Core Concepts](#core-concepts)
- [Quick Template (Lightweight)](#quick-template-lightweight)
- [Context](#context)
- [Decision](#decision)
- [Consequences](#consequences)
- [Y-Statement Format (Ultra-Compact)](#y-statement-format-ultra-compact)
- [Review Checklist](#review-checklist)
- [Best Practices](#best-practices)
- [Directory Structure](#directory-structure)
- [adr-tools Commands](#adr-tools-commands)
- [References](#references)
- [External Resources](#external-resources)

Capture the context and rationale behind significant technical decisions.

## When to Use

| Write ADR | Skip ADR |
|-----------|----------|
| New framework adoption | Minor version upgrades |
| Database choice | Bug fixes |
| API design patterns | Implementation details |
| Security architecture | Routine maintenance |
| Integration patterns | Configuration changes |

## Core Concepts

### What is an ADR?

- **Context**: Why we needed to decide
- **Decision**: What we decided
- **Consequences**: What happens as a result

### ADR Lifecycle

```
Proposed → Accepted → Deprecated → Superseded
              ↓
           Rejected
```

## Quick Template (Lightweight)

```markdown
# ADR-NNNN: [Title]

**Status**: [Proposed | Accepted | Deprecated | Superseded]
**Date**: YYYY-MM-DD
**Deciders**: @person1, @person2

## Context
[What changed, what constraints exist, and why a decision is needed now]

## Decision
[What is being adopted or rejected]

## Alternatives Considered
- [Option A]: [why not chosen]
- [Option B]: [why not chosen]
**Good**: [Benefits]
**Bad**: [Drawbacks]
**Mitigations**: [How to address drawbacks]
```

## Y-Statement Format (Ultra-Compact)

```markdown
In the context of **[situation]**,
facing **[problem]**,
we decided for **[chosen option]**
and against **[rejected options]**,
to achieve **[outcomes]**,
accepting that **[trade-offs]**.
```

## Review Checklist

### Before Submission
- [ ] Context explains the problem
- [ ] All viable options considered
- [ ] Pros/cons balanced
- [ ] Consequences documented
- [ ] Related ADRs linked

### After Acceptance
- [ ] Index updated
- [ ] Team notified
- [ ] Implementation tickets created

## Best Practices

### Do's
- Write ADRs early (before implementation)
- Keep them short (1-2 pages)
- Be honest about trade-offs
- Link related decisions
- Update status when superseded

### Don'ts
- Don't change accepted ADRs (write new ones)
- Don't skip context
- Don't hide failures (rejected decisions are valuable)
- Don't be vague

## Directory Structure

```
docs/adr/
├── README.md           # Index
├── template.md         # Team template
├── 0001-use-postgresql.md
├── 0002-caching-strategy.md
└── 0020-deprecate-mongodb.md
```

## adr-tools Commands

```bash
adr init docs/adr                    # Initialize
adr new "Use PostgreSQL"             # Create new
adr new -s 3 "Deprecate MongoDB"     # Supersede
adr generate toc > docs/adr/README.md  # Generate index
```

## References

- **[references/templates.md](references/templates.md)** - MADR, lightweight, Y-statement, deprecation, RFC templates
- **[references/management-guide.md](references/management-guide.md)** - Directory structure, adr-tools, review process
- **[references/examples.md](references/examples.md)** - Database, API versioning, GraphQL, security examples

## External Resources

- [Michael Nygard: Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [MADR Template](https://adr.github.io/madr/)
- [adr-tools](https://github.com/npryce/adr-tools)
