---
name: event-store-design
description: "Designs event stores for event-sourced systems."
origin: lamella
---

# Event Store Design

Use this skill when designing the persistence layer for event-sourced systems.

## When to Use

- Choosing between EventStoreDB, PostgreSQL, DynamoDB, or streaming-backed approaches
- Designing stream layout, global ordering, and concurrency checks
- Defining append-only persistence and replay boundaries
- Reviewing subscription and projection needs before implementation

## Core Requirements

- append-only writes
- per-stream ordering
- optimistic concurrency
- replayable event history
- idempotent append behavior
- projection or subscription support

## Core Workflow

1. Define aggregate and stream boundaries.
2. Choose the storage technology based on ordering, query, and ops constraints.
3. Design write contracts around optimistic concurrency and idempotency.
4. Separate read models and subscriptions from the primary append path.
5. Plan for event versioning and replay before the first production write.

## Technology Guide

| Option | Good fit |
|-------|----------|
| EventStoreDB | dedicated event-sourcing platform |
| PostgreSQL | teams already operating Postgres well |
| DynamoDB | serverless AWS-native event storage |
| Kafka | event streaming backbone, not always best as the primary store |

## Guardrails

- never mutate or delete historical events
- keep payloads small and explicit
- version events from day one
- test replay and projection rebuild as first-class workflows
