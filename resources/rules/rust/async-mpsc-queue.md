# async-mpsc-queue

> Use `mpsc` channels for async message queues between tasks

Use `mpsc` when many producers send work or events to one consumer path.

## Prefer

- `mpsc` for request intake, worker queues, and serialized background processing
- bounded capacity unless unbounded growth is truly acceptable
- explicit shutdown behavior when all senders or the receiver drop

## Avoid

- using `mpsc` when every subscriber should receive every message
- encoding request-response with ad hoc shared state when `oneshot` can carry the reply
- hiding overload behind large queue depth

## See Also

- [async-bounded-channel](./async-bounded-channel.md) - Apply backpressure
- [async-oneshot-response](./async-oneshot-response.md) - Return one response per request
