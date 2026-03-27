# Prototype and Creation Tradeoffs

## Prototype

Use Prototype when cloning an existing configured instance is cleaner than
repeating the full setup path.

Typical fit:

- seeded test objects
- document or workflow templates
- expensive-to-configure base objects

## Selection Rule

- one global shared instance: maybe Singleton, but question it first
- one configurable product type: Factory Method
- multiple compatible product families: Abstract Factory
- many optional steps: Builder
- clone from a working baseline: Prototype
