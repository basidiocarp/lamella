# Concurrency Patterns

Use the concurrency model that matches the workload, not the one that seems most
modern.

## Threading

Best for:
- network I/O
- file I/O
- blocking database clients

Threads are usually the simplest way to overlap blocking work.

## Multiprocessing

Best for:
- CPU-heavy transforms
- numerical or media processing
- work that benefits from bypassing the GIL

The tradeoff is higher startup and serialization overhead.

## Asyncio

Best for:
- high-concurrency I/O
- async web services
- many simultaneous network or queue operations

Asyncio works best when the full call path is async-aware.

## Selection Guide

| Approach | Better for |
|---|---|
| threading | blocking I/O |
| multiprocessing | CPU-bound work |
| asyncio | high-concurrency async I/O |

## Safety Rules

- guard shared mutable state with locks or explicit coordination
- keep async boundaries clean
- do not mix concurrency models casually inside one flow
- choose the simplest model that meets the load profile

Concurrency helps only when the workload and execution model actually match.
