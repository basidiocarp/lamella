# Behavior Variation Patterns

## State

Use when behavior changes according to explicit runtime state and giant
conditionals are taking over the class.

## Strategy

Use when the algorithm should vary independently from the caller.

## Template Method

Use when a workflow skeleton stays fixed but certain steps should vary.

## Visitor as the Edge Case

Use Visitor only when you truly need to add operations across a stable object
structure. If the model changes often, Visitor usually becomes costly to
maintain.
