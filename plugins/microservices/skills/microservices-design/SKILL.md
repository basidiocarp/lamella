---
name: microservices-design
description: "Designs microservices architectures with service boundaries, event-driven communication, and resilience patterns."
origin: lamella
---

# Microservices Architect

## Scope

Covers service decomposition, domain-driven design, resilience patterns, service mesh, and cloud-native architectures. Focus on systems that scale, self-heal, and enable autonomous teams.

## When to Use This Skill

- Decomposing monoliths into microservices
- Defining service boundaries and bounded contexts
- Designing inter-service communication patterns
- Implementing resilience patterns (circuit breakers, retries, bulkheads)
- Setting up service mesh (Istio, Linkerd)
- Designing event-driven architectures
- Implementing distributed transactions (Saga, CQRS)
- Establishing observability (tracing, metrics, logging)

## Core Workflow

1. **Domain Analysis** - Apply DDD to identify bounded contexts and service boundaries
2. **Communication Design** - Choose sync/async patterns, protocols (REST, gRPC, events)
3. **Data Strategy** - Database per service, event sourcing, eventual consistency
4. **Resilience** - Circuit breakers, retries, timeouts, bulkheads, fallbacks
5. **Observability** - Distributed tracing, correlation IDs, centralized logging
6. **Deployment** - Container orchestration, service mesh, progressive delivery

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Service Boundaries | `references/decomposition.md` | Monolith decomposition, bounded contexts, DDD |
| Communication | `references/communication.md` | REST vs gRPC, async messaging, event-driven |
| Resilience Patterns | `references/patterns.md` | Circuit breakers, saga, bulkhead, retry strategies |
| Data Management | `references/data.md` | Database per service, event sourcing, CQRS |
| Observability | `references/observability.md` | Distributed tracing, correlation IDs, metrics |

## Constraints

### MUST DO
- Apply domain-driven design for service boundaries
- Use database per service pattern
- Implement circuit breakers for external calls
- Add correlation IDs to all requests
- Use async communication for cross-aggregate operations
- Design for failure and graceful degradation
- Implement health checks and readiness probes
- Use API versioning strategies

### MUST NOT DO
- Create distributed monoliths
- Share databases between services
- Use synchronous calls for long-running operations
- Skip distributed tracing implementation
- Ignore network latency and partial failures
- Create chatty service interfaces
- Store shared state without proper patterns
- Deploy without observability

## Common Pitfalls

- **Distributed Monolith**: Tightly coupled services
- **Chatty Services**: Too many inter-service calls
- **Shared Databases**: Tight coupling through data
- **No Circuit Breakers**: Cascade failures
- **Synchronous Everything**: Poor resilience
- **Premature Microservices**: Starting micro instead of monolith-first
- **No Compensation Logic**: Can't undo failed transactions

## Output Templates

When designing microservices architecture, provide:
1. Service boundary diagram with bounded contexts
2. Communication patterns (sync/async, protocols)
3. Data ownership and consistency model
4. Resilience patterns for each integration point
5. Deployment and infrastructure requirements

## Knowledge Reference

Domain-driven design, bounded contexts, event storming, REST/gRPC, message queues (Kafka, RabbitMQ), service mesh (Istio, Linkerd), Kubernetes, circuit breakers, saga patterns, event sourcing, CQRS, distributed tracing (Jaeger, Zipkin), API gateways, eventual consistency, CAP theorem
### Additional Resources

- [Communication Patterns](references/communication-patterns.md)
- [Decomposition Patterns](references/decomposition-patterns.md)
- [Resilience Patterns](references/resilience-patterns.md)
