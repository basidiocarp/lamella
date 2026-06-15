# Facade, Proxy, and Flyweight

## Facade

Use Facade to give callers one clean entry point into a messy subsystem.

## Proxy

Use Proxy when access, lifecycle, caching, or remoting behavior should sit in
front of the real object.

## Flyweight

Use Flyweight when many objects can safely share immutable or repeated state.

## Selection Rule

- simplify a subsystem API: Facade
- control or defer access to an object: Proxy
- reduce duplicated in-memory state: Flyweight
