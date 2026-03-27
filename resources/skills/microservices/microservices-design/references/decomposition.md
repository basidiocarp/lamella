# Decomposition

Use this reference when deciding where a monolith should split into service boundaries.

## Boundary Signals

- Distinct business capabilities
- Different scaling or latency requirements
- Different ownership or release cadence
- Data that naturally clusters around one capability

## Anti-Signals

- Splitting only by technical layer
- Creating services for tiny CRUD wrappers
- Forcing boundaries where transactional workflows remain tightly coupled

## Practical Rule

Start with bounded contexts and operational realities, not org-chart mirroring or premature platform fashion.
