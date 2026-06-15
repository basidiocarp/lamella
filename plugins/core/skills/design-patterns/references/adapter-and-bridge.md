# Adapter and Bridge

## Adapter

Use Adapter when you must fit an existing interface into the shape your client
already expects.

Good fit:

- third-party integration
- legacy API compatibility
- migration layers between old and new modules

Smell it fixes: incompatible interfaces forcing callsite rewrites everywhere.

## Bridge

Use Bridge when both the abstraction and the implementation need to vary
independently.

Good fit:

- UI components with multiple renderers
- transport-independent domain services
- abstraction families that should not hard-bind to one backend

Smell it fixes: two dimensions of change tangled into one inheritance tree.
