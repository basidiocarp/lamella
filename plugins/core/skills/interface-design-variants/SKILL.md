---
name: interface-design-variants
description: "Run this before finalizing an interface — designs and compares multiple materially different interface shapes."
origin: lamella
---

# Interface Design Variants

Compare multiple interface shapes before committing to one.

## When to Use

- A module or service boundary is still fuzzy
- More than one public API shape could work
- A design feels "obvious" too early
- Callers, tests, and internal responsibilities still blur together

## When NOT to Use

- The boundary already exists and only needs minor edits
- The task is pure implementation with no interface choice
- The user wants a direct patch to an existing API

## Workflow

1. **Clarify the boundary**: Define what the module owns, who calls it, and what it must hide.
2. **Inspect existing usage**: Read adjacent code, call sites, and tests before inventing a new shape.
3. **Generate variants**: Produce 2-3 materially different interface designs. Prefer different tradeoffs, not cosmetic renames.
4. **Compare explicitly**: Evaluate ergonomics, hidden complexity, testability, migration cost, and failure behavior.
5. **Recommend one**: Pick a default and explain why the others lose.
6. **Capture the contract**: Show the proposed interface, a short usage example, and the responsibilities hidden behind it.

## Variant Rules

- Change the abstraction, not just the method names.
- Make at least one option bias toward a narrow surface area.
- Make at least one option bias toward caller convenience.
- Reject variants that leak internal sequencing or storage details.

## Output Format

For each variant, include:

- **Interface shape**: the public surface
- **Best for**: where it works well
- **Risk**: what it makes worse
- **Usage example**: one short example

End with:

- **Recommendation**
- **Why not the others**
- **Migration notes** if the interface replaces existing code
