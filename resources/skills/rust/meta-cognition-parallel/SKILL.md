---
name: meta-cognition-parallel
description: "Applies an experimental three-layer Rust analysis workflow."
argument-hint: <rust_question>
origin: lamella
---
# Meta-Cognition Parallel Analysis

> Status: experimental

Use this skill when a Rust question benefits from three simultaneous views: language mechanics, design trade-offs, and domain constraints.

## When to Use

- The question mixes compiler errors with architectural choices
- A Rust fix depends on performance, safety, or domain-specific constraints
- A single-layer answer would likely overfit to syntax and ignore product context

## Three Layers

| Layer | Focus |
|------|-------|
| Language mechanics | ownership, borrowing, lifetimes, compiler errors |
| Design choices | sharing model, mutability strategy, abstraction trade-offs |
| Domain constraints | latency, safety, throughput, compliance, ergonomics |

## Core Workflow

1. Parse the user question and isolate the concrete Rust problem.
2. Analyze language mechanics first.
3. Analyze candidate design patterns and trade-offs.
4. Evaluate domain constraints that may override the technically simplest fix.
5. Synthesize one recommendation that is valid across all three layers.

## Output Contract

Produce these sections:

1. `Layer 1: Language Mechanics`
2. `Layer 2: Design Choices`
3. `Layer 3: Domain Constraints`
4. `Cross-Layer Synthesis`

Each layer should include:
- the key finding
- recommended direction
- confidence level

The synthesis should end with:
- `Do`
- `Don't`
- `Code Pattern`

## Notes

- Run the three layers in parallel when the environment supports clean delegation.
- Otherwise, execute the same workflow sequentially in one answer.
- Do not assume bundled analyzers exist; the method matters more than specific helper files.
