# opt-cold-unlikely

> Mark unlikely code paths with `#[cold]` to help compiler optimization

Mark truly rare slow paths as cold when profiling shows layout or codegen
benefit.

## Prefer

- `#[cold]` on rare error or fallback paths
- small isolated cold functions rather than annotating broad call chains
- measurement before adding hint attributes

## Avoid

- sprinkling cold hints everywhere
- marking code cold just because it looks “non-happy-path” without evidence
- expecting attributes to rescue a bigger algorithmic issue

## See Also

- [opt-inline-never-cold](./opt-inline-never-cold.md) - Keep cold paths out of hot codegen
- [opt-likely-hint](./opt-likely-hint.md) - Prefer structure before branch hints
