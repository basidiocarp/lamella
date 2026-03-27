# Async Programming Patterns

Use this reference as a compact catalog of Python async building blocks.

## Core Patterns

- `async` and `await` for direct I/O
- `TaskGroup` or equivalent structured concurrency
- async context managers for owned resources
- async iterators and generators for streaming
- semaphores and queues for backpressure
- explicit cancellation cleanup

## Rules

- keep concurrency bounded when upstream capacity matters
- close owned resources in `finally` or context managers
- treat cancellation as normal control flow
- do not hide sync blocking work inside async code without an executor strategy

## Watch For

- missing `await`
- runaway `gather()` fan-out
- background tasks with no lifecycle owner
- async functions that leak sockets, sessions, or temp files on cancellation
