# Creational Design Patterns

Use this page as the routing layer for creational GoF patterns.

## Load Order

| Need | Reference |
| --- | --- |
| singleton tradeoffs and single-product factories | `singleton-and-factory-method.md` |
| compatible product families and stepwise object construction | `abstract-factory-and-builder.md` |
| cloning patterns and creation-shape tradeoffs | `prototype-and-creation-tradeoffs.md` |

## Core Rules

- Prefer dependency injection and clear constructors before reaching for more
  elaborate creation patterns.
- Use creational patterns when object setup is the real source of complexity,
  not when the domain logic itself is unclear.
