# Execution Protocols

Use this page as the routing layer for sequential execution. The detailed protocol is split so the caller can load only the part needed at a given step.

## Reference Map

| Need | Load |
|------|------|
| What to pass forward between steps | [context-passing.md](context-passing.md) |
| How to assemble implementer prompts | [prompt-construction.md](prompt-construction.md) |
| How to judge a completed step | [judge-verification.md](judge-verification.md) |
| How to handle retries and loop control | [retry-loop.md](retry-loop.md) |

## Core Loop

1. Dispatch the implementer with focused instructions.
2. Capture only the context needed by later steps.
3. Dispatch an independent judge for the step.
4. Continue on pass; retry on specific failures.
5. Keep the shared task artifact current after each iteration.

## Keep in Mind

- Sequential execution succeeds when each step passes forward only the minimum state the next step needs.
- The judge should verify the step, not redesign the whole plan.
- Retries should target the reported failure list rather than re-running the entire step blindly.
