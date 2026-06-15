# Branch by Abstraction, Extract Service, and Adapter

## Branch by Abstraction

- introduce an interface first
- route callers through the abstraction
- swap implementations behind flags or constructor wiring

## Extract Service

- move cohesive business logic out of controllers or giant classes
- keep validation, orchestration, and side effects explicit
- preserve observable behavior before improving internals

## Adapter

- wrap legacy APIs that use incompatible naming, payloads, or sync/async style
- use adapters to protect new code from legacy quirks
