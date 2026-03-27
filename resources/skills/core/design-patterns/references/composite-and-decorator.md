# Composite and Decorator

## Composite

Use Composite when clients should treat leaves and containers through the same
interface.

Good fit:

- file trees
- UI composition trees
- nested product or policy structures

## Decorator

Use Decorator when you need to add behavior around an object without exploding
subclass combinations.

Good fit:

- logging or auth wrappers
- progressive response shaping
- layered cross-cutting behavior

Watch out for decorator order sensitivity and overly deep wrapper stacks.
