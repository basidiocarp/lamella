# Facade and Repository Patterns

## Facade

- place a simpler interface in front of a tangled subsystem
- keep the facade stable while legacy internals are reshaped underneath
- good fit for auth, reporting, or billing subsystems with many entry points

## Repository

- centralize persistence details so controllers and services stop issuing raw
  queries everywhere
- use repositories to prepare for later ORM swaps or schema changes
- keep business policy above the repository layer
