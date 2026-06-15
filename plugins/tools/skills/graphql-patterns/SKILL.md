---
name: graphql-patterns
description: "Designs GraphQL schemas, resolvers, federation layouts, and subscriptions."
origin: lamella
---
# GraphQL Patterns

Design GraphQL APIs that stay readable under growth. Focus on schema boundaries, resolver behavior, federation, and query performance.

## Scope

Covers schema-first design, Apollo Federation, resolver patterns, DataLoader, and real-time subscriptions.

## When to Use This Skill

- Designing GraphQL schemas and type systems
- Implementing Apollo Federation architectures
- Building resolvers with DataLoader optimization
- Creating real-time GraphQL subscriptions
- Optimizing query complexity and performance
- Setting up authentication and authorization

## Core Workflow

1. **Domain Modeling** - Map business domains to GraphQL type system
2. **Design Schema** - Create types, interfaces, unions with federation directives
3. **Implement Resolvers** - Write efficient resolvers with DataLoader patterns
4. **Secure** - Add query complexity limits, depth limiting, field-level auth
5. **Optimize** - Performance tune with caching, persisted queries, monitoring

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Schema Design | `references/schema-design.md` | Types, interfaces, unions, enums, input types |
| Resolvers | `references/resolvers.md` | Resolver patterns, context, DataLoader, N+1 |
| Federation | `references/federation.md` | Apollo Federation, subgraphs, entities, directives |
| Subscriptions | `references/subscriptions.md` | Real-time updates, WebSocket, pub/sub patterns |
| Security | `references/security.md` | Routing page for query guardrails, authz, validation, and transport hardening |
| REST Migration | `references/migration-from-rest.md` | Migrating REST APIs to GraphQL |

## Constraints

### MUST DO
- Use schema-first design approach
- Implement proper nullable field patterns
- Use DataLoader for batching and caching
- Add query complexity analysis
- Document all types and fields
- Follow GraphQL naming conventions (camelCase)
- Use federation directives correctly
- Provide example queries for all operations

### MUST NOT DO
- Create N+1 query problems
- Skip query depth limiting
- Expose internal implementation details
- Use REST patterns in GraphQL
- Return null for non-nullable fields
- Skip error handling in resolvers
- Hardcode authorization logic
- Ignore schema validation

## Output Templates

When implementing GraphQL features, provide:
1. Schema definition (SDL with types and directives)
2. Resolver implementation (with DataLoader patterns)
3. Query/mutation/subscription examples
4. Brief explanation of design decisions

## Knowledge Reference

Apollo Server, Apollo Federation 2.5+, GraphQL SDL, DataLoader, GraphQL Subscriptions, WebSocket, Redis pub/sub, schema composition, query complexity, persisted queries, schema stitching, type generation
