# Root Cause Tracing

Trace backwards through the call chain until you find the original trigger, then fix there.

## Workflow

1. observe the symptom
2. find the immediate cause
3. ask what called it
4. keep tracing upward
5. identify the original trigger
6. fix at the source
7. add defense-in-depth checks

## Instrumentation Pattern

```typescript
async function gitInit(directory: string) {
  console.error("DEBUG git init", {
    directory,
    cwd: process.cwd(),
    stack: new Error().stack,
  });

  await execFileAsync("git", ["init"], { cwd: directory });
}
```

## Rule of Thumb

Never stop at the symptom layer if the invalid input or state came from somewhere earlier in the chain.
