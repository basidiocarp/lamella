# Categorizing Skills, Rules, and Workflows

Quick reference for determining where new content should live.

## Quick Test

**Is it a Rule?**
- Always applies → **Rule**
- Declarative (what, not how) → **Rule**
- Short checklist → **Rule**

**Is it a Workflow?**
- Multi-step sequence → **Workflow**
- Agent chain defined → **Workflow**
- Has trigger → execution → output → **Workflow**

**Is it a Skill?**
- Deep domain knowledge → **Skill**
- Specialized techniques → **Skill**
- "How to" guidance → **Skill**

## Decision Tree

```
                    ┌────────────────────────────────┐
                    │     New content to add?        │
                    └────────────────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
    │ Always applies? │  │ Multi-step with │  │ Deep knowledge  │
    │ Short standard? │  │  agent chain?   │  │ or techniques?  │
    └─────────────────┘  └─────────────────┘  └─────────────────┘
              │                    │                    │
              ▼                    ▼                    ▼
         ┌────────┐          ┌──────────┐          ┌────────┐
         │  RULE  │          │ WORKFLOW │          │ SKILL  │
         └────────┘          └──────────┘          └────────┘
```

## Examples by Category

### Rules
Rules are always-on standards that apply automatically:

| Content | Why It's a Rule |
|---------|-----------------|
| Coding standards | Always applies to all code |
| Writing style | Always applies to prose |
| Verification before completion | Always required behavior |
| Confidence check | Always required pre-implementation |
| Clarification questions | Always applies when underspecified |
| Context management | Always relevant during sessions |

### Workflows
Workflows have sequential phases with defined triggers:

| Content | Why It's a Workflow |
|---------|---------------------|
| TDD | Test → Implement → Verify cycle |
| Commit | Branch → Lint → Diff → Commit phases |
| Search-first | Search → Evaluate → Decide → Implement phases |
| Verification | Build → Type → Lint → Test → Security phases |
| Critique | Gather → Review → Debate → Report phases |
| Do-and-judge | Implement → Judge → Retry loop |

### Skills
Skills provide deep domain knowledge with specialized techniques:

| Content | Why It's a Skill |
|---------|------------------|
| Design patterns | Deep pattern detection knowledge |
| Playwright | Specialized testing techniques |
| Django patterns | Framework-specific expertise |
| Security review | Specialized security knowledge |
| Error handling | Database-backed error knowledge system |

## Organization

```text
resources/
├── rules/
│   ├── common/           # Language-agnostic baselines
│   ├── python/           # Language-specific rule extensions
│   └── ...
├── workflows/
│   ├── development/      # Bug fixes, new features, commits
│   ├── quality/          # Verification, review, audit
│   └── ...
└── skills/
    ├── design-patterns/  # Domain-specific deep knowledge
    ├── playwright/       # Specialized techniques
    └── ...
```

## Migration Checklist

When auditing content location:

1. **Check scope**: Does it apply always or situationally?
2. **Check structure**: Is it sequential with phases?
3. **Check depth**: Is it deep knowledge or a standard?
4. **Move accordingly**: Rules → `resources/rules/`, Workflows → `resources/workflows/`, Skills → `resources/skills/`
5. **Update references**: Update any READMEs that reference moved content
