# Inheritance and Deep Merge

Atmos merges imported, inherited, and inline configuration in a defined
precedence order.

## Core Merge Rules

- scalars: later values replace earlier values
- maps: merge recursively
- lists: higher-priority list replaces the lower-priority list

## Precedence Order

1. global imported scope
2. component-type scope
3. inherited base components
4. component inline definition
5. overrides

## Practical Rules

- use inheritance for reusable defaults and traits
- keep inheritance lists short enough that override order is understandable
- remember that list replacement is absolute, not additive
- use `describe component` to inspect the final merged result when behavior is
  surprising
