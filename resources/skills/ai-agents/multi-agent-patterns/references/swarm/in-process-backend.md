# In-Process Backend

Use this backend when fast startup matters more than live worker visibility.

## Characteristics

- Workers run inside the same process as the leader
- Fastest startup and lowest overhead
- Worker output is less visible in real time
- Workers end when the leader exits

## Best Fit

- CI
- Short-lived parallel work
- Non-interactive automation
