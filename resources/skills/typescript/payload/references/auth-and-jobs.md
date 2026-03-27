# Auth and Jobs

This slice covers Payload auth features and background job execution.

## Focus

- login and password flows
- custom auth strategies or API keys
- queued tasks and workflows

## Rule

Do not couple job design to auth concerns unless the worker really needs user
or role context.
