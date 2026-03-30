# async-clone-before-await

> Clone Arc/Rc data before await points to avoid holding references across suspension

Clone shared handles before `.await` when later work still needs them.

## Prefer

- clone cheap shared handles such as `Arc` before entering async blocks or loops
- move owned data into spawned tasks instead of borrowing across `.await`
- narrow borrow lifetimes so suspension points do not hold references longer than needed

## Avoid

- holding references, guards, or iterators across `.await` when a cheap clone solves it
- cloning large owned data just to silence borrow errors
- using this rule to hide a state-sharing problem that should be redesigned

## See Also

- [async-no-lock-await](./async-no-lock-await.md) - Do not hold locks across `.await`
- [async-join-parallel](./async-join-parallel.md) - Run independent futures concurrently
