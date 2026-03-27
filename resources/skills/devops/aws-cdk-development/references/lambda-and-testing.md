# Lambda and Testing

## Lambda Constructs

TypeScript or JavaScript:

```typescript
const fn = new NodejsFunction(this, "Function", {
  entry: "src/handlers/process.ts",
  handler: "handler",
})
```

Python:

```typescript
const fn = new PythonFunction(this, "Function", {
  entry: "src/handlers",
  index: "process.py",
  handler: "handler",
  runtime: lambda.Runtime.PYTHON_3_12,
})
```

## Snapshot and Assertion Testing

```typescript
const template = Template.fromStack(stack)
template.resourceCountIs("AWS::Lambda::Function", 3)
```

Use snapshot tests for broad drift and fine-grained assertions for security-critical properties.
