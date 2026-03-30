# async-bounded-channel

> Use bounded channels to apply backpressure and prevent unbounded memory growth

Prefer bounded channels when producers can outrun consumers.

## Prefer

- choose capacity from expected burst size, not from convenience
- make full-channel behavior explicit: await, drop, shed, or retry
- use bounded channels for work queues and background task pipelines

## Avoid

- unbounded channels on hot paths
- capacities so large that they hide overload instead of surfacing it
- treating a channel as lossless when backpressure policy is undefined

## See Also

- [async-mpsc-queue](./async-mpsc-queue.md) - Queue work between tasks
- [async-broadcast-pubsub](./async-broadcast-pubsub.md) - Fan out messages to many subscribers
