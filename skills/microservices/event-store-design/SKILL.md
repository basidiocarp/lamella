---
name: event-store-design
description: Design and implement event stores for event-sourced systems. Use when building event sourcing infrastructure, choosing event store technologies, or implementing event persistence patterns.
---

# Event Store Design


## Contents

- [When to Use This Skill](#when-to-use-this-skill)
- [Core Concepts](#core-concepts)
  - [1. Event Store Architecture](#1-event-store-architecture)
  - [2. Event Store Requirements](#2-event-store-requirements)
- [Technology Comparison](#technology-comparison)
- [Templates](#templates)
  - [Template 1: PostgreSQL Event Store Schema](#template-1-postgresql-event-store-schema)
  - [Template 2: Python Event Store Implementation](#template-2-python-event-store-implementation)
  - [Template 3: EventStoreDB Usage](#template-3-eventstoredb-usage)
  - [Template 4: DynamoDB Event Store](#template-4-dynamodb-event-store)
- [Best Practices](#best-practices)
  - [Do's](#dos)
  - [Don'ts](#donts)
- [Resources](#resources)


Comprehensive guide to designing event stores for event-sourced applications.

## When to Use This Skill

- Designing event sourcing infrastructure
- Choosing between event store technologies
- Implementing custom event stores
- Optimizing event storage and retrieval
- Setting up event store schemas
- Planning for event store scaling

## Core Concepts

### 1. Event Store Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Event Store                       │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Stream 1   │  │   Stream 2   │  │   Stream 3   │ │
│  │ (Aggregate)  │  │ (Aggregate)  │  │ (Aggregate)  │ │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤ │
│  │ Event 1     │  │ Event 1     │  │ Event 1     │ │
│  │ Event 2     │  │ Event 2     │  │ Event 2     │ │
│  │ Event 3     │  │ ...         │  │ Event 3     │ │
│  │ ...         │  │             │  │ Event 4     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────┤
│  Global Position: 1 → 2 → 3 → 4 → 5 → 6 → ...     │
└─────────────────────────────────────────────────────┘
```

### 2. Event Store Requirements

| Requirement       | Description                        |
| ----------------- | ---------------------------------- |
| **Append-only**   | Events are immutable, only appends |
| **Ordered**       | Per-stream and global ordering     |
| **Versioned**     | Optimistic concurrency control     |
| **Subscriptions** | Real-time event notifications      |
| **Idempotent**    | Handle duplicate writes safely     |

## Technology Comparison

| Technology       | Best For                  | Limitations                      |
| ---------------- | ------------------------- | -------------------------------- |
| **EventStoreDB** | Pure event sourcing       | Single-purpose                   |
| **PostgreSQL**   | Existing Postgres stack   | Manual implementation            |
| **Kafka**        | High-throughput streaming | Not ideal for per-stream queries |
| **DynamoDB**     | Serverless, AWS-native    | Query limitations                |
| **Marten**       | .NET ecosystems           | .NET specific                    |

## Templates

### Template 1: PostgreSQL Event Store Schema

```sql
-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_id VARCHAR(255) NOT NULL,
    stream_type VARCHAR(255) NOT NULL,
// ... (34 lines trimmed)
    last_position BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Template 2: Python Event Store Implementation

```python
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Optional, List
from uuid import UUID, uuid4
import json
// ... (166 lines trimmed)
class ConcurrencyError(Exception):
    """Raised when optimistic concurrency check fails."""
    pass
```

### Template 3: EventStoreDB Usage

```python
from esdbclient import EventStoreDBClient, NewEvent, StreamState
import json

# Connect
client = EventStoreDBClient(uri="esdb://localhost:2113?tls=false")
// ... (54 lines trimmed)
def read_category(category: str):
    """Read all events for a category using system projection."""
    return read_stream(f"$ce-{category}")
```

### Template 4: DynamoDB Event Store

```python
import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime
import json
import uuid
// ... (47 lines trimmed)

Capacity: On-demand or provisioned based on throughput needs
"""
```

## Best Practices

### Do's

- **Use stream IDs that include aggregate type** - `Order-{uuid}`
- **Include correlation/causation IDs** - For tracing
- **Version events from day one** - Plan for schema evolution
- **Implement idempotency** - Use event IDs for deduplication
- **Index appropriately** - For your query patterns

### Don'ts

- **Don't update or delete events** - They're immutable facts
- **Don't store large payloads** - Keep events small
- **Don't skip optimistic concurrency** - Prevents data corruption
- **Don't ignore backpressure** - Handle slow consumers

## Resources

- [EventStoreDB](https://www.eventstore.com/)
- [Marten Events](https://martendb.io/events/)
- [Event Sourcing Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing)
