---
title: "Design Pattern Quality Evaluation Checklist"
description: "Systematic scoring criteria for evaluating design pattern implementation quality"
tags: [cheatsheet, design-patterns, code-review]
---

# Design Pattern Quality Evaluation Checklist

Use this checklist to score how well a codebase applies a design pattern. Score each criterion from `0` to `10`, then average the results.

## Score Bands

| Score | Meaning |
|------|---------|
| `9-10` | reference-quality implementation |
| `7-8` | solid implementation with minor issues |
| `5-6` | acceptable but notable refactoring opportunity |
| `3-4` | pattern is compromised or hard to maintain |
| `0-2` | incorrect or actively harmful implementation |

## Criteria

### 1. Correctness

Question: does the implementation actually preserve the pattern’s structure and intent?

Checks:
- core roles are present
- delegation or composition is correct
- invariants are preserved
- clients depend on the intended abstraction

Common deductions:
- missing core role
- incorrect delegation
- invariant broken by convenience shortcut

### 2. Testability

Question: can the implementation be tested without brittle setup or global state?

Checks:
- dependencies are injectable
- abstractions can be mocked or stubbed
- side effects are controllable
- tests can run in isolation

Common deductions:
- hidden singletons
- hard-coded concrete classes
- business logic reaching directly into global process or framework state

### 3. Single Responsibility

Question: does the pattern implementation stay focused on one reason to change?

Checks:
- class or module has one clear role
- helper logic does not sprawl into unrelated concerns
- naming matches actual responsibility

### 4. Open/Closed Behavior

Question: can new behavior be added without rewriting the existing implementation?

Checks:
- extension happens through composition, inheritance, or new implementations
- behavior changes do not require editing multiple switch statements
- callers remain stable as variants grow

### 5. Coupling and Cohesion

Question: is the pattern reducing coupling instead of moving it around?

Checks:
- collaborators are explicit
- responsibilities stay near the data or behavior they belong to
- there is no hidden framework dependency doing the real work

### 6. Practicality

Question: does the pattern earn its complexity in this codebase?

Checks:
- the abstraction solves a real variation point
- it does not introduce ceremony without payoff
- simpler alternatives were considered

## Fast Evaluation Table

| Criterion | Score | Notes |
|----------|------:|-------|
| Correctness | 0-10 | |
| Testability | 0-10 | |
| Single responsibility | 0-10 | |
| Open/closed behavior | 0-10 | |
| Coupling and cohesion | 0-10 | |
| Practicality | 0-10 | |

## Quick Example

| Implementation trait | Likely score impact |
|----------------------|---------------------|
| singleton hidden behind global accessor | lower testability |
| decorator not delegating to wrapped object | lower correctness |
| strategy interface with swappable implementations | higher openness |
| factory that still returns concrete types everywhere | lower abstraction value |
