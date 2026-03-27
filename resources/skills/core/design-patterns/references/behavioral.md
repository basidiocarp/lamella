# Behavioral Design Patterns

Use this page as the routing layer for behavioral GoF patterns.

## Load Order

| Need | Reference |
| --- | --- |
| request pipelines, encapsulated actions, and traversal behavior | `chain-command-and-iterator.md` |
| coordination, snapshots, and subscriber relationships | `mediator-memento-and-observer.md` |
| behavior-variation patterns, plus Visitor as the main edge-case add-on | `state-strategy-template-and-visitor.md` |

## Core Rules

- Prefer native language or framework primitives when they express the same
  pattern more simply.
- Choose behavioral patterns to clarify decision flow and coordination, not to
  create ceremony around simple logic.
