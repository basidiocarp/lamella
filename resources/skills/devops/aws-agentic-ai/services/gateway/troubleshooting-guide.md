# AgentCore Gateway Troubleshooting Guide

Use this guide when Gateway setup or runtime behavior is failing and you need a fast triage path.

## Quick Triage Order

1. confirm the gateway exists
2. confirm the target exists and is attached to the expected gateway
3. confirm credential providers and secret access
4. validate the OpenAPI schema
5. inspect X-Ray and CloudWatch signals if the control-plane setup looks correct

## Common Failure Buckets

### Target Creation Fails

Check:
- gateway identifier
- credential provider name
- schema location and syntax
- S3 or schema access permissions

### Permission Errors

Typical root cause: the Gateway service role is missing permission to read credentials or secrets.

Verify:

```shell
aws bedrock-agentcore-control get-gateway --gateway-identifier <GATEWAY_ID>
aws iam get-role --role-name <ROLE_NAME>
```

### Credential Provider Issues

Check whether the provider exists and whether the underlying secret contains the expected shape.

### OpenAPI Schema Issues

Validate locally before assuming the problem is in Gateway:

```shell
swagger-cli validate schemas/my-api-openapi.yaml
```

Watch for:
- unsupported schema constructs
- missing `operationId`
- invalid references
- oversized schemas

### Rate Limits and Runtime Errors

Check both Gateway-side quotas and upstream API behavior before treating 429s as a pure client issue.

## Useful Commands

```shell
aws bedrock-agentcore-control get-gateway --gateway-identifier <GATEWAY_ID>
aws bedrock-agentcore-control list-gateway-targets --gateway-identifier <GATEWAY_ID>
aws bedrock-agentcore-control get-gateway-target --gateway-identifier <GATEWAY_ID> --target-identifier <TARGET_ID>
aws xray get-trace-summaries --start-time <START> --end-time <END>
```
