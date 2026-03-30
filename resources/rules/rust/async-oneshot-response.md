# async-oneshot-response

> Use `oneshot` channel for request-response patterns

Use `oneshot` when one task needs to deliver exactly one reply or completion
signal to another.

## Prefer

- pairing `mpsc` requests with a `oneshot` responder for per-request replies
- `oneshot` for completion notification or cancellation acknowledgement
- explicit handling for dropped senders or receivers

## Avoid

- using `mpsc` for single replies
- holding shared mutable state just to communicate one result
- treating a dropped `oneshot` as impossible

## See Also

- [async-mpsc-queue](./async-mpsc-queue.md) - Queue requests
- [async-select-racing](./async-select-racing.md) - Wait on response, timeout, or cancellation
