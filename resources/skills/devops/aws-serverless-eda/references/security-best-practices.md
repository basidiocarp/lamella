# Serverless Security Best Practices

Serverless security is mostly about tightening IAM, controlling event entry points, and treating every integration as untrusted input.

## IAM First

Grant the narrowest permissions possible:
- one function, one role when practical
- explicit resource scopes
- no broad admin policies in application roles

Review for:
- wildcard actions
- wildcard resources
- privileges copied from examples without pruning

## Secret Handling

Use:
- AWS Secrets Manager
- SSM Parameter Store
- encrypted environment variables only when access patterns are simple

Do not:
- hardcode secrets
- log secret material
- pass secrets through event payloads unnecessarily

## Event Source Security

Validate every input boundary:
- API Gateway requests
- EventBridge events
- SQS messages
- S3 event-driven processors

Rules:
- verify shape and required fields
- reject unknown or malformed input early
- treat replayed or duplicated events as normal behavior

## Function Isolation

Keep functions narrow:
- one domain concern per function where possible
- separate public-facing handlers from internal processors
- separate sensitive workflows from generic utility handlers

This reduces blast radius and permission creep.

## Network and Data Controls

Use VPC attachment only when required. It adds complexity and can hurt cold starts.

Protect data with:
- encryption at rest
- encryption in transit
- least-privilege access to tables, buckets, queues, and topics

## Async Failure Safety

Secure failure paths too:
- DLQs should not leak sensitive payloads broadly
- replay tooling should be access-controlled
- failed-event storage should be treated as sensitive operational data

## Observability for Security

Log:
- auth failures
- denied actions
- unusual retry bursts
- privileged workflow activity

Monitor for:
- unexpected invocation sources
- spikes in access-denied events
- unusual deployment or config changes

## Default Security Rule

```text
Least privilege everywhere
Validate every event boundary
Keep secrets out of code and logs
Separate sensitive functions from generic ones
Secure the failure and replay path, not just the happy path
```
