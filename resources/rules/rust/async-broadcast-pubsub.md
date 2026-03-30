# async-broadcast-pubsub

> Use `broadcast` channel for pub/sub where all subscribers receive all messages

Use `broadcast` when many listeners should observe the same event stream.

## Prefer

- `broadcast` for fan-out notifications and shared event feeds
- handling lagging receivers explicitly
- message payloads that are cheap enough to clone for each subscriber

## Avoid

- using `broadcast` as a work queue
- assuming slow subscribers will see every message forever
- large payloads that make fan-out cloning expensive

## See Also

- [async-watch-latest](./async-watch-latest.md) - Share only the latest state
- [async-mpsc-queue](./async-mpsc-queue.md) - Deliver work to one consumer path
