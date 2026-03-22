# ADR Management Guide

## Directory Structure

<!-- Example directory layout - paths are illustrative -->
```
docs/
├── adr/
│   ├── README.md           # Index and guidelines
│   ├── template.md         # Team's ADR template
│   ├── 0001-use-postgresql.md
│   ├── 0002-caching-strategy.md
│   ├── 0003-mongodb-user-profiles.md  # [DEPRECATED]
│   └── 0020-deprecate-mongodb.md      # Supersedes 0003
```

---

## ADR Index Template (README.md)

<!-- Example README.md for an ADR directory - file links are illustrative -->
```markdown
# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for [Project Name].

## Index
// ... (19 lines trimmed)
- **Deprecated**: No longer relevant
- **Superseded**: Replaced by another ADR
- **Rejected**: Considered but not adopted
```

---

## Automation with adr-tools

### Installation

```bash
# macOS
brew install adr-tools

# Linux (manual)
git clone https://github.com/npryce/adr-tools.git
cd adr-tools
./install.sh /usr/local/bin
```

### Common Commands

```bash
# Initialize ADR directory
adr init docs/adr

# Create new ADR
adr new "Use PostgreSQL as Primary Database"
// ... (11 lines trimmed)

# List all ADRs
adr list
```

---

## Review Process

### Before Submission

- [ ] Context clearly explains the problem
- [ ] All viable options considered
- [ ] Pros/cons balanced and honest
- [ ] Consequences (positive and negative) documented
- [ ] Related ADRs linked
- [ ] No implementation details (separate doc)

### During Review

- [ ] At least 2 senior engineers reviewed
- [ ] Affected teams consulted
- [ ] Security implications considered
- [ ] Cost implications documented
- [ ] Reversibility assessed
- [ ] Timeline reasonable

### After Acceptance

- [ ] ADR index updated
- [ ] Team notified (Slack/email)
- [ ] Implementation tickets created
- [ ] Related documentation updated
- [ ] Scheduled review if needed

---

## Status Transitions

```
                    ┌─────────┐
                    │Proposed │
                    └────┬────┘
                         │
              ┌──────────┼──────────┐
// ... (9 lines trimmed)
│Deprecated│     │Superseded │
└──────────┘     │(by ADR-N) │
                 └───────────┘
```

---

## Naming Conventions

### ADR Numbering

- Use 4-digit numbers: `0001`, `0042`, `0123`
- Never reuse numbers (even for rejected ADRs)
- Gap numbers are OK (don't renumber)

### File Naming

```
NNNN-short-descriptive-title.md

Good:
0001-use-postgresql.md
0015-adopt-typescript.md
0042-api-versioning-strategy.md

Bad:
1-database.md           # No leading zeros
0001.md                 # No description
0001-postgresql-database-selection-decision.md  # Too long
```

### Title Format

```markdown
# ADR-NNNN: [Verb] [Subject] [Context]

Good:
# ADR-0001: Use PostgreSQL as Primary Database
# ADR-0015: Adopt TypeScript for Frontend
# ADR-0042: Version API Using URL Path

Bad:
# Database Decision        # Too vague
# PostgreSQL               # Just a noun
# Why We Should Use Redis  # Too informal
```

---

## Common Pitfalls

| Pitfall | Problem | Solution |
|---------|---------|----------|
| Too detailed | Becomes implementation doc | Keep to decision + rationale |
| Too vague | Not useful for future reference | Include specific criteria |
| No alternatives | Looks like rubber stamp | Document at least 2-3 options |
| All pros, no cons | Not balanced | Be honest about trade-offs |
| Changed after acceptance | Loses historical value | Create new superseding ADR |
| No index | Hard to discover | Maintain README.md |
| No review | Siloed decisions | Require PR review process |
