# Payload Queries

Query Payload through Local API, REST, or GraphQL depending on the caller and
trust boundary.

## Main Query Surfaces

- Local API for in-process access
- REST for external callers and conventional HTTP clients
- GraphQL for graph-shaped client requirements

## Core Rules

- keep query filters explicit and typed
- pass `req` through nested local operations when transaction context matters
- do not assume Local API respects access control unless `overrideAccess` is
  set appropriately
- limit depth and selected fields when relationships can explode response size
