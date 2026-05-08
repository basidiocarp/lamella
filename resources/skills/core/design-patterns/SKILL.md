---
name: design-patterns
description: "Run this when analyzing code structure — identifies GoF design patterns, refactoring opportunities, and stack-specific adaptations."
origin: lamella
---
# Design Patterns


## Contents

- [Core Capabilities](#core-capabilities)
- [Operating Modes](#operating-modes)
- [Quick Reference](#quick-reference)
- [Reference Files](#reference-files)


Detect, suggest, and evaluate Gang of Four (GoF) design patterns in TypeScript and JavaScript codebases with stack-aware adaptations.

## Core Capabilities

1. **Stack Detection**: Identify primary framework/library (React, Angular, NestJS, Vue, Express, RxJS, Redux, ORMs)
2. **Pattern Detection**: Find existing implementations of 23 GoF patterns
3. **Smart Suggestions**: Recommend patterns to fix code smells, using stack-native idioms when available
4. **Quality Evaluation**: Assess pattern implementation quality against best practices

## Operating Modes

### Mode 1: Detection

**Trigger**: User requests pattern detection or analysis

**Workflow**:
1. Stack Detection (package.json, tsconfig.json, framework files)
2. Pattern Search (Glob for candidates → Grep for signatures → Read for validation)
3. Classification (native to stack vs custom implementations)
4. Confidence Scoring (0.0-1.0 based on detection rules)
5. JSON Report Generation

**Example**:
```bash
/design-patterns detect src/
/design-patterns analyze --format=json
```

### Mode 2: Suggestion

**Trigger**: User requests pattern suggestions or refactoring advice

**Workflow**:
1. Code Smell Detection (switch statements, long parameter lists, global state, etc.)
2. Pattern Matching (map smell → applicable patterns)
3. Stack Adaptation (prefer native framework patterns over custom)
4. Priority Ranking (impact × feasibility)
5. Markdown Report with Code Examples

**Example**:
```bash
/design-patterns suggest src/payment/
/design-patterns refactor --focus=creational
```

### Mode 3: Evaluation

**Trigger**: User requests pattern quality assessment

**Workflow**:
1. Pattern Identification (which pattern is implemented)
2. Criteria Assessment (correctness, testability, SOLID compliance, documentation)
3. Issue Detection (common mistakes, anti-patterns)
4. Scoring (0-10 per criterion)
5. JSON Report with Recommendations

**Example**:
```bash
/design-patterns evaluate src/services/singleton.ts
/design-patterns quality --pattern=observer
```

## Quick Reference

### Pattern Coverage

**Creational (5)**: Singleton, Factory Method, Abstract Factory, Builder, Prototype

**Structural (7)**: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy

**Behavioral (11)**: Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor, Interpreter

### Classification Types

- `native`: Pattern using stack-native features (React Context, Angular Services, etc.)
- `custom`: Manual TypeScript implementation
- `library`: Third-party library providing pattern (RxJS Subject, Redux Store, etc.)

### Confidence Scoring

| Score | Meaning |
|-------|---------|
| 0.9-1.0 | All signals present, exact structure match |
| 0.7-0.89 | Primary signals + some secondary |
| 0.5-0.69 | Primary signals, missing secondary |
| 0.3-0.49 | Naming match, weak structure |
| 0.0-0.29 | Insufficient evidence |

### Stack-Native Alternatives

| Pattern | Stack | Native Alternative |
|---------|-------|-------------------|
| Singleton | React | Context API + Provider |
| Observer | Angular | RxJS Subject/BehaviorSubject |
| Decorator | NestJS | @Injectable() + Interceptors |
| Strategy | Vue 3 | Composition API composables |
| Chain of Responsibility | Express | Middleware |
| Command | Redux | Action creators + reducers |

## Reference Files

- `references/output-formats.md` - JSON and Markdown output examples for all modes
- `references/methodology-details.md` - Detailed phases: stack detection, pattern detection, code smell detection, suggestions, evaluation
- `references/constraints-guidelines.md` - Language focus, pattern coverage, performance considerations, usage examples

## Architecture Principles

- **Library-First**: Always search for existing solutions before writing custom code. Use established libraries (e.g., `cockatiel` for retry logic) over hand-rolled utilities. Custom code is justified for domain-specific logic, performance-critical paths, or security-sensitive code.
- **Domain Naming**: Avoid generic names (`utils`, `helpers`, `common`). Use domain-specific names (`OrderCalculator`, `UserAuthenticator`).
- **Separation of Concerns**: Keep business logic out of UI components and database queries out of controllers.
### Additional Resources


| File | Path |
|------|------|
| [Behavioral](references/behavioral.md) | `references/behavioral.md` |
| [Constraints Usage](references/constraints-usage.md) | `references/constraints-usage.md` |
| [Creational](references/creational.md) | `references/creational.md` |
| [Patterns Index](references/patterns-index.yaml) | `references/patterns-index.yaml` |
| [Structural](references/structural.md) | `references/structural.md` |
