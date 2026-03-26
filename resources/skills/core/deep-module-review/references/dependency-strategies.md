# Dependency Strategies

Use these categories when deciding whether a shallow area can be turned into a deeper module.

## In-process

Pure computation or in-memory state with no I/O boundary.

Recommendation:
- Merge directly if the interface becomes clearer.
- Test through the new boundary instead of old helper seams.

## Local-substitutable

Dependencies with a realistic local stand-in, such as an in-memory file system or test database.

Recommendation:
- Deepen the module if the substitute is stable enough for tests.
- Keep the production integration behind the module boundary.

## Remote but owned

Internal services across a network or queue boundary that your team controls.

Recommendation:
- Define a port at the module boundary.
- Keep production transport in an adapter.
- Test the module with an in-memory or local adapter.

## True external

Third-party services you do not control.

Recommendation:
- Mock only at the external edge.
- Keep retry, validation, mapping, and orchestration inside the deepened module.

## Testing Rule

Replace shallow tests with boundary tests when the new interface is stable enough to carry the behavior.
