# async-watch-latest

> Use `watch` channel for sharing the latest value with multiple observers

Use `watch` when readers only need the newest state, not the full history.

## Prefer

- `watch` for config updates, health state, or mode changes
- reading the current value immediately on subscription when that matters
- accepting that intermediate values may be skipped

## Avoid

- using `watch` as a work queue or audit log
- expecting every update to be processed individually by every observer
- large payloads that are expensive to clone for each change

## See Also

- [async-broadcast-pubsub](./async-broadcast-pubsub.md) - Fan out every event
- [async-select-racing](./async-select-racing.md) - React to state change, timeout, or shutdown
