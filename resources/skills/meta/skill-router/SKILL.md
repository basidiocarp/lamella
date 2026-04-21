---
name: skill-router
description: "Routes questions to the right skill, plugin, or agent."
origin: lamella
---

# Skill Router


## Contents

- [The Three Levels](#the-three-levels)
- [Routing by Entry Point](#routing-by-entry-point)
- [Skill/Plugin Routing Table](#skillplugin-routing-table)
- [Dual-Skill Loading](#dual-skill-loading)
- [Priority Order](#priority-order)
- [Externalized Cognition](#externalized-cognition)
- [3-Strike Escalation](#3-strike-escalation)

Route questions through a 3-level reasoning framework instead of answering directly. Trace through levels to find the contextually-appropriate solution.

## The Three Levels

```
Level 3: Requirements / Domain (WHY)
  Business rules, domain constraints, regulatory requirements
  "Why is it designed this way?"

Level 2: Design / Architecture (WHAT)
  Patterns, architecture decisions, abstractions
  "What pattern should I use?"

Level 1: Implementation (HOW)
  Language features, framework APIs, tooling
  "How do I implement this?"
```

## Routing by Entry Point

| User Signal | Entry Level | Direction | Route To |
|-------------|-------------|-----------|----------|
| Error / stack trace | Level 1 | Trace UP | Language-specific skill or systematic-debugging |
| "How to design..." | Level 2 | Check L3, then DOWN | Architecture plugin or patterns |
| "Building a [domain] app" | Level 3 | Trace DOWN | Domain-specific plugin |
| "Best practice for..." | Level 2 | Both directions | Relevant skill + coding-standards |
| Performance issue | Level 1 then 2 | UP then DOWN | performance-observability plugin |
| Security concern | Level 3 | DOWN | security plugin |
| Test failure | Level 1 | UP | systematic-debugging + testing |

## Skill/Plugin Routing Table

### By Language

| Language | Skills | Agents | Plugin |
|----------|--------|--------|--------|
| TypeScript/JS | typescript, react-patterns, nextjs-app-router, zustand-store-ts | — | developer-essentials |
| Python | python-development skills | python-advanced, django-pro, fastapi-pro | python-development |
| Rust | rust-async-patterns, memory-safety-patterns | rust-pro | systems-programming, rust-development |
| Go | go-concurrency-patterns | golang-advanced | systems-programming |
| C/C++ | memory-safety-patterns | c-pro, cpp-pro | systems-programming |
| Bash/Shell | shell-scripting skills | bash-pro | shell-scripting |

### By Domain

| Domain | Plugin | Key Skills |
|--------|--------|------------|
| Web/API | api-development | REST, GraphQL, OpenAPI |
| Frontend | developer-essentials | react-patterns, nextjs-app-router |
| Database | database-design | Schema modeling, PostgreSQL |
| Infrastructure | infrastructure-as-code | Terraform |
| CI/CD | build-and-ci | GitHub Actions, Makefile |
| Containers | docker-containers | Dockerfile, Compose |
| Security | security | OWASP, STRIDE, SAST |
| Performance | performance-observability | Tracing, SLOs, Prometheus |
| Documentation | documentation | ADRs, diagrams, OpenAPI |
| CMS | payload | Payload CMS |

### By Activity

| Activity | Plugin/Skill | When |
|----------|-------------|------|
| Debugging | debugging (systematic-debugging) | Any bug, test failure, unexpected behavior |
| Code Review | code-review | After writing code |
| Refactoring | code-refactoring | Tech debt, cleanup |
| Testing | unit-testing, testing, playwright | Writing or fixing tests |
| Planning | developer-essentials | Complex feature requests |
| Architecture | c4-architecture | System design, diagrams |
| Team Work | agent-teams | Multi-agent coordination |

## Dual-Skill Loading

When a question spans multiple domains, load BOTH relevant skills:

| Pattern | Load Both |
|---------|-----------|
| Language error + domain context | Language skill + domain skill |
| Performance + specific framework | performance-observability + framework skill |
| Security + specific language | security + language skill |
| Testing + specific framework | testing + framework skill |

Example: "My React component is slow" -> load BOTH react-patterns AND performance-observability.

## Priority Order

1. **Error codes / stack traces** -> direct lookup, highest priority
2. **Cross-domain queries** -> load both domain + implementation skills
3. **Design questions** -> check requirements first, then route to pattern skill
4. **General concept** -> route to most specific matching skill

## Externalized Cognition

For complex problems that span multiple levels, create a `_reasoning/` directory with trace, findings, and decision files.

## 3-Strike Escalation

If a fix approach fails 3 times at the same level:
- Level 1 failure -> escalate to Level 2 (question the design)
- Level 2 failure -> escalate to Level 3 (question the requirements)

See the `systematic-debugging` skill for escalation guidance after repeated failed fixes.
