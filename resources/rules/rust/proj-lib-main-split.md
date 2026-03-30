# proj-lib-main-split

> Keep application logic in `lib.rs` and `main.rs` thin

Put reusable logic in the library crate surface and keep the binary entrypoint
small.

## Prefer

- argument parsing, wiring, and process exit in `main.rs`
- real behavior in library modules that tests can call directly
- one clear path from CLI entrypoint into reusable application logic

## Avoid

- business logic buried only in `main.rs`
- binaries that are hard to test because all behavior is inside the entrypoint
- exporting a large public library API only because `main.rs` became too fat

## See Also

- [proj-bin-dir](./proj-bin-dir.md) - Organize multiple binaries cleanly
- [test-integration-dir](./test-integration-dir.md) - Test public entry flows
