# Async Tool Selection

Use this reference to choose the right async PHP runtime.

| Option | Best For | Tradeoff |
| --- | --- | --- |
| Swoole | maximum throughput, built-in HTTP and WebSocket features | extension required |
| ReactPHP | event-loop services with broad package compatibility | promise-heavy model |
| Amphp | modern async ergonomics with fibers | more framework buy-in |
| Native fibers only | low-level experimentation | too bare for most production services |

## Selection Rule

- pick Swoole when performance and built-in server primitives dominate
- pick ReactPHP for package-driven event loops
- pick Amphp when fiber ergonomics matter and the team accepts the dependency
