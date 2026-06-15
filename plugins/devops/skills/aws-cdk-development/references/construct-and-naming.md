# Construct and Naming Patterns

## Resource Naming

Prefer automatic naming when the resource does not need a stable external name.

```typescript
const bucket = new s3.Bucket(this, "DataBucket", {
  encryption: s3.BucketEncryption.S3_MANAGED,
})
```

Use explicit names only when an external system or cross-environment contract requires them.

## Reusable Constructs

Wrap repeated infrastructure into custom constructs:

```typescript
export class ApiWithDatabase extends Construct {
  public readonly api: apigateway.RestApi
  public readonly table: dynamodb.Table

  constructor(scope: Construct, id: string) {
    super(scope, id)
    this.table = new dynamodb.Table(this, "Table", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
    })
    this.api = new apigateway.RestApi(this, "Api")
  }
}
```

## Review Checklist

- stable names only where necessary
- construct boundaries match reuse boundaries
- stack layout is obvious to a new maintainer
