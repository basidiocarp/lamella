# own-lifetime-elision

> Rely on lifetime elision rules; add explicit lifetimes only when required

Keep lifetime syntax minimal when Rust can infer it cleanly.

## Prefer

- elision for ordinary borrowed methods and functions
- explicit lifetimes only when they express a relationship the compiler requires
- semantic lifetime names only when they improve understanding

## Avoid

- explicit lifetimes added only out of habit
- relying on elision when the actual borrow relationship is unclear
- verbose lifetime syntax that hides the real signature

## See Also

- [name-lifetime-short](./name-lifetime-short.md) - Use conventional lifetime names
- [type-generic-bounds](./type-generic-bounds.md) - Keep generic signatures readable
