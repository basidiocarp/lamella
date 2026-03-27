# Abstract Factory and Builder

## Abstract Factory

Use when related objects must be created as a compatible family.

Typical fit:

- themed UI widget families
- environment-specific service sets
- products that must stay internally consistent

## Builder

Use when an object has many optional or ordered setup steps and plain
constructors become unreadable.

Typical fit:

- fluent configuration APIs
- complex test fixtures
- staged validation before final construction
