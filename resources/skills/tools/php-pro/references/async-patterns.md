# Async PHP Patterns

Use this file as the routing page for async PHP approaches.

## Open These References By Task

1. [swoole-patterns.md](./swoole-patterns.md)
   Use for coroutine servers, channels, and extension-backed high-throughput
   runtimes.
2. [reactphp-patterns.md](./reactphp-patterns.md)
   Use for event loops, promise-based flows, and package-first async stacks.
3. [amphp-and-fibers.md](./amphp-and-fibers.md)
   Use for fiber-backed async code and modern cooperative concurrency.
4. [async-tool-selection.md](./async-tool-selection.md)
   Use when deciding which async runtime fits the project.

## Practical Rule

Pick one async model per service. Avoid mixing Swoole, ReactPHP, and Amphp in
the same runtime unless you have a very specific boundary and understand the
tradeoffs.
