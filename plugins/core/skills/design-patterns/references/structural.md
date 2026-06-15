# Structural Design Patterns

Use this page as the routing layer for structural GoF patterns.

## Load Order

| Need | Reference |
| --- | --- |
| interface adaptation and decoupling abstraction from implementation | `adapter-and-bridge.md` |
| tree composition, dynamic behavior wrapping, and uniform part-whole handling | `composite-and-decorator.md` |
| simplified subsystem entry points, controlled access, and memory-sharing tradeoffs | `facade-proxy-and-flyweight.md` |

## Core Rules

- Prefer stack-native structure patterns when the framework already gives you
  the same leverage.
- Use structural patterns to reduce coupling and simplify composition, not to
  hide bad boundaries.
- If the pattern only exists to patch one awkward callsite, reconsider the API
  shape first.
