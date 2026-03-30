# proj-pub-crate-internal

> Use `pub(crate)` for crate-wide internal APIs

Prefer the narrowest visibility that matches the real audience.

## Prefer

- `pub(crate)` for internal shared helpers across modules
- private-by-default visibility until a broader audience is justified
- tightening visibility during refactors when public exposure was accidental

## Avoid

- plain `pub` for items that are only used inside the crate
- pseudo-private conventions enforced only by comments
- widening visibility just to make tests easier

## See Also

- [proj-pub-super-parent](./proj-pub-super-parent.md) - Use narrower scoped visibility where possible
- [proj-pub-use-reexport](./proj-pub-use-reexport.md) - Expose a curated public surface
