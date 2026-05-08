---
name: deep-module-review
description: "Run this when reviewing architecture — identifies shallow modules, brittle seams, and candidates for deep-module refactoring."
origin: lamella
---

# Deep Module Review

Find places where the code exposes too much surface area for too little payoff.

## When to Use

- A feature spans too many small files or fragile seams
- Tests focus on internals instead of stable boundaries
- A module's interface feels almost as complex as its implementation
- The codebase is hard to navigate without jumping across layers

## When NOT to Use

- The task is a local bug fix with no structural concern
- The code is unstable enough that architecture review would be premature
- The user wants a direct implementation instead of an architecture assessment

## Workflow

1. **Explore the boundary**: Read the code path end-to-end before proposing changes.
2. **Find friction**: Note where understanding one concept requires too many hops, mocks, or coordination points.
3. **Identify candidates**: Prefer seams where one clearer interface could hide meaningful complexity.
4. **Classify dependencies**: Use [references/dependency-strategies.md](references/dependency-strategies.md) to decide whether a candidate can be deepened safely.
5. **Recommend a boundary**: Describe the interface the new module should expose and the responsibilities it should absorb.
6. **Describe the test strategy**: Explain how tests should move to the new interface boundary and which shallow tests become unnecessary.

## Output Format

For each candidate, include:

- **Problem**: the current structural friction
- **Proposed boundary**: what the deepened module should own
- **Dependency strategy**: in-process, substitutable, port-based, or mocked
- **Testing impact**: what new boundary tests to add and what old tests to retire
- **Migration note**: how callers should move to the new interface
