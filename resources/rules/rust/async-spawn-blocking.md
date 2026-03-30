# async-spawn-blocking

> Use `spawn_blocking` for CPU-intensive work

Move blocking or CPU-heavy work off async executor threads.

## Prefer

- `spawn_blocking` for blocking filesystem calls, compression, parsing, or CPU-bound transforms
- small async wrappers around blocking sections instead of blocking inside the runtime
- measuring before offloading tiny operations that do not matter

## Avoid

- running heavy CPU work on core async worker threads
- treating `spawn_blocking` as a substitute for well-bounded concurrency
- moving truly async I/O into `spawn_blocking`

## See Also

- [async-tokio-runtime](./async-tokio-runtime.md) - Runtime configuration
- [async-tokio-fs](./async-tokio-fs.md) - Prefer async filesystem APIs when they exist
