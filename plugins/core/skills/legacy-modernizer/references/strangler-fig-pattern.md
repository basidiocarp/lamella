# Strangler Fig Pattern

Use strangler-fig migration when you need to replace a legacy path
incrementally without a big-bang cutover.

## Core Shape

```text
client -> facade/router -> legacy implementation or new implementation
```

## Practical Sequence

1. insert a stable facade in front of the legacy path
2. add routing controls such as feature flags, tenant allowlists, or percentage
   rollout
3. implement the new slice behind the facade
4. compare metrics and behavior during partial traffic
5. remove the legacy path only after sustained parity

## Where It Works Best

- API endpoint replacement
- service extraction from a monolith
- UI component replacement behind a wrapper
- read-path migrations before write-path migrations

## Guardrails

- keep rollback trivial: one routing change, not emergency code edits
- avoid dual-write unless you have reconciliation and failure handling
- define parity metrics up front: error rate, latency, correctness, support load
