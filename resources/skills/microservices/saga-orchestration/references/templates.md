# Saga Orchestration Templates

## Template 1: Saga Orchestrator Base

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Any, Dict, List, Optional


class SagaStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    COMPENSATING = "compensating"
    COMPENSATED = "compensated"


@dataclass
class SagaStep:
    name: str
    action: str
    compensation: str
    payload: Dict[str, Any]
    result: Optional[Dict[str, Any]] = None


@dataclass
class SagaState:
    saga_id: str
    data: Dict[str, Any]
    steps: List[SagaStep] = field(default_factory=list)
    completed_steps: List[SagaStep] = field(default_factory=list)
    status: SagaStatus = SagaStatus.PENDING
    failed_step: Optional[str] = None
    started_at: datetime = field(default_factory=datetime.utcnow)


class SagaOrchestrator(ABC):
    def __init__(self, event_bus, saga_store):
        self.event_bus = event_bus
        self.saga_store = saga_store

    @abstractmethod
    def build_steps(self, data: Dict[str, Any]) -> List[SagaStep]:
        raise NotImplementedError

    async def start(self, saga_id: str, data: Dict[str, Any]) -> SagaState:
        saga = SagaState(saga_id=saga_id, data=data, steps=self.build_steps(data))
        saga.status = SagaStatus.RUNNING
        await self.saga_store.save(saga)

        try:
            for step in saga.steps:
                step.result = await self.event_bus.request(step.action, step.payload)
                saga.completed_steps.append(step)
                await self.saga_store.save(saga)
        except Exception as exc:
            saga.status = SagaStatus.COMPENSATING
            saga.failed_step = step.name
            await self.rollback(saga, str(exc))
            raise

        saga.status = SagaStatus.COMPLETED
        await self.saga_store.save(saga)
        return saga

    async def rollback(self, saga: SagaState, reason: str) -> None:
        for step in reversed(saga.completed_steps):
            await self.event_bus.publish(
                step.compensation,
                {
                    "saga_id": saga.saga_id,
                    "step_name": step.name,
                    "reason": reason,
                    "original_result": step.result,
                    **saga.data,
                },
            )

        saga.status = SagaStatus.COMPENSATED
        await self.saga_store.save(saga)
```

## Template 2: Order Fulfillment Saga

```python
class OrderFulfillmentSaga(SagaOrchestrator):
    def build_steps(self, order_data: Dict[str, Any]) -> List[SagaStep]:
        return [
            SagaStep(
                name="reserve_inventory",
                action="inventory.reserve",
                compensation="inventory.release",
                payload={
                    "order_id": order_data["order_id"],
                    "items": order_data["items"],
                },
            ),
            SagaStep(
                name="charge_payment",
                action="payments.charge",
                compensation="payments.refund",
                payload={
                    "order_id": order_data["order_id"],
                    "amount": order_data["total_amount"],
                    "payment_method": order_data["payment_method"],
                },
            ),
            SagaStep(
                name="create_shipment",
                action="shipping.create",
                compensation="shipping.cancel",
                payload={
                    "order_id": order_data["order_id"],
                    "shipping_address": order_data["shipping_address"],
                },
            ),
        ]
```

## Template 3: Service Event Handlers

```python
class InventoryService:
    async def handle_reserve_items(self, command: Dict[str, Any]) -> None:
        try:
            reservation = await self.reserve(command["items"], command["order_id"])
            await self.event_publisher.publish(
                "InventoryReserved",
                {
                    "saga_id": command["saga_id"],
                    "order_id": command["order_id"],
                    "reservation_id": reservation.id,
                },
            )
        except OutOfStockError as exc:
            await self.event_publisher.publish(
                "InventoryReservationFailed",
                {
                    "saga_id": command["saga_id"],
                    "order_id": command["order_id"],
                    "reason": str(exc),
                },
            )

    async def handle_release_items(self, command: Dict[str, Any]) -> None:
        await self.release(command["order_id"])
        await self.event_publisher.publish(
            "SagaCompensationCompleted",
            {"saga_id": command["saga_id"], "step_name": "reserve_inventory"},
        )
```

## Template 4: Choreography-Based Saga

```python
class OrderEventCoordinator:
    def __init__(self, publisher):
        self.publisher = publisher

    async def on_order_created(self, event: Dict[str, Any]) -> None:
        await self.publisher.publish(
            "ReserveInventoryRequested",
            {"saga_id": event["saga_id"], "order_id": event["order_id"], "items": event["items"]},
        )

    async def on_inventory_reserved(self, event: Dict[str, Any]) -> None:
        await self.publisher.publish(
            "ChargePaymentRequested",
            {
                "saga_id": event["saga_id"],
                "order_id": event["order_id"],
                "amount": event["amount"],
            },
        )

    async def on_payment_failed(self, event: Dict[str, Any]) -> None:
        await self.publisher.publish(
            "ReleaseInventoryRequested",
            {
                "saga_id": event["saga_id"],
                "order_id": event["order_id"],
                "reason": "Payment failed",
            },
        )
```

## Template 5: Saga with Timeouts

```python
class TimeoutSagaOrchestrator(SagaOrchestrator):
    def __init__(self, saga_store, event_bus, scheduler):
        super().__init__(event_bus, saga_store)
        self.scheduler = scheduler

    async def schedule_timeout(self, saga_id: str, step_name: str, timeout_seconds: int) -> None:
        await self.scheduler.schedule(
            topic="saga.step_timeout",
            delay=timedelta(seconds=timeout_seconds),
            payload={"saga_id": saga_id, "step_name": step_name},
        )

    async def handle_timeout(self, data: Dict[str, Any]) -> None:
        saga = await self.saga_store.load(data["saga_id"])
        if saga.status != SagaStatus.RUNNING:
            return

        saga.failed_step = data["step_name"]
        saga.status = SagaStatus.COMPENSATING
        await self.rollback(saga, f"{data['step_name']} timed out")
```
