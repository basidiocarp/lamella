# CloudWatch Alarms Reference

Use this file as the routing layer for common CloudWatch alarm patterns.

## Load Order

| Need | Reference |
| --- | --- |
| Lambda and API Gateway alarms | `serverless-and-api-alarms.md` |
| DynamoDB, EC2, and RDS alarms | `data-and-compute-alarms.md` |
| ECS and SQS alarms | `container-and-queue-alarms.md` |

## Core Rules

- Pick alarms by service behavior, not by copying the same threshold everywhere.
- Prefer alarms that map to a concrete operator action.
- Keep alarm examples grouped by AWS surface so the reference stays navigable.
