# name-lifetime-short

> Use short, conventional lifetime names: `'a`, `'b`, `'de`, `'src`

Prefer conventional lifetimes unless a semantic name materially helps.

## Prefer

- short standard names like `'a` and `'b` for ordinary borrowing relationships
- semantic names like `'de` only when the role is standard and helpful
- consistency within one signature or impl block

## Avoid

- verbose lifetime names that add noise without clarity
- single-letter names when several lifetimes have very different roles and need explanation

## See Also

- [own-lifetime-elision](./own-lifetime-elision.md) - Rely on elision where it applies
- [type-generic-bounds](./type-generic-bounds.md) - Keep signatures readable
