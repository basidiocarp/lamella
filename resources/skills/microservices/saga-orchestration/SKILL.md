---
name: saga-orchestration
description: "Implements saga orchestration patterns for distributed transactions."
origin: lamella
---

# Saga Orchestration


## Contents

- [When to Use](#when-to-use)
- [Saga Types](#saga-types)
- [Saga States](#saga-states)
- [Core Components](#core-components)
- [Example: Order Fulfillment](#example-order-fulfillment)
- [Template Overview](#template-overview)
- [Best Practices](#best-practices)
- [Compensation Strategies](#compensation-strategies)
- [Error Handling](#error-handling)
- [Resources](#resources)

Manage distributed transactions and long-running business processes.

## When to Use

- Coordinating multi-service transactions
- Implementing compensating transactions
- Managing long-running workflows
- Handling failures in distributed systems
- Building order fulfillment processes
- Implementing approval workflows

## Saga Types

| Type | Pros | Cons |
|------|------|------|
| **Choreography** | Loose coupling, simple | Hard to track, cyclic deps |
| **Orchestration** | Central control, visible | Single point of failure |

## Saga States

| State | Description |
|-------|-------------|
| **Started** | Saga initiated |
| **Pending** | Waiting for step |
| **Compensating** | Rolling back |
| **Completed** | All steps succeeded |
| **Failed** | Failed after compensation |

## Core Components

### SagaStep

```python
@dataclass
class SagaStep:
    name: str           # e.g., "reserve_inventory"
    action: str         # Command to execute
    compensation: str   # Rollback command
    status: str = "pending"
    result: Optional[Dict] = None
```

### Saga Flow

1. **Execute step** - publish action command
2. **On success** - advance to next step
3. **On failure** - start compensation (reverse order)
4. **Compensate each completed step** - rollback actions

## Example: Order Fulfillment

```python
steps = [
    SagaStep("reserve_inventory", "InventoryService.ReserveItems",
             "InventoryService.ReleaseReservation"),
    SagaStep("process_payment", "PaymentService.ProcessPayment",
             "PaymentService.RefundPayment"),
    SagaStep("create_shipment", "ShippingService.CreateShipment",
             "ShippingService.CancelShipment"),
    SagaStep("send_confirmation", "NotificationService.SendOrderConfirmation",
             "NotificationService.SendCancellationNotice")
]
```

If payment fails after inventory reserved:
1. Compensation triggered
2. `ReleaseReservation` called
3. Order marked failed

## Template Overview

| Template | Purpose |
|----------|---------|
| Orchestrator Base | Foundation class with state machine |
| Order Fulfillment | Concrete multi-step saga |
| Service Handlers | Pattern for step execution |
| Choreography | Event-driven alternative |
| Timeout Saga | Add deadline handling |

See [references/templates.md](references/templates.md) for complete implementations.

## Best Practices

### Dos

- **Make steps idempotent** - Safe to retry
- **Design compensations carefully** - They must work
- **Use correlation IDs** - For tracing across services
- **Implement timeouts** - Do not wait forever
- **Log everything** - For debugging failures

### Donts

- **Do not assume instant completion** - Sagas take time
- **Do not skip compensation testing** - Most critical part
- **Do not couple services** - Use async messaging
- **Do not ignore partial failures** - Handle gracefully

## Compensation Strategies

| Strategy | Use When |
|----------|----------|
| **Undo** | Action is reversible (release reservation) |
| **Compensating TX** | Financial (credit account) |
| **No-op** | Step is idempotent or already handled |
| **Manual intervention** | Cannot auto-recover |

## Error Handling

```python
async def handle_step_failed(self, saga_id: str, step_name: str, error: str):
    saga = await self.saga_store.get(saga_id)
    saga.state = SagaState.COMPENSATING
    await self._compensate(saga)  # Reverse order
```

## Resources

- [references/templates.md](references/templates.md) - Complete template implementations
- [Saga Pattern](https://microservices.io/patterns/data/saga.html)
