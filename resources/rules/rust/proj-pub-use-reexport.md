# proj-pub-use-reexport

> Use `pub use` to present a cleaner public API than the internal module layout

Re-export intentionally when it improves the public surface.

## Prefer

- `pub use` for a small, curated API root
- internal modules optimized for maintenance and external exports optimized for ergonomics
- stable external paths even when internals move

## Avoid

- re-exporting everything
- making the crate root a grab bag of loosely related items
- re-exports that hide ownership so much that navigation becomes confusing

## See Also

- [proj-mod-by-feature](./proj-mod-by-feature.md) - Keep internal structure coherent
- [proj-prelude-module](./proj-prelude-module.md) - Use a prelude only when it stays small and obvious
