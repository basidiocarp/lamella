# proj-prelude-module

> Use a prelude module sparingly for common imports

Add a prelude only when repeated imports are stable, obvious, and broadly
useful.

## Prefer

- a small prelude for frequently used traits or core domain types
- explicit naming such as `prelude` when the pattern is intentional
- keeping the prelude stable and unsurprising

## Avoid

- dumping half the crate into a prelude
- preludes that hide where important behavior comes from
- adding a prelude before repetition is real

## See Also

- [proj-pub-use-reexport](./proj-pub-use-reexport.md) - Re-export intentionally
- [proj-mod-by-feature](./proj-mod-by-feature.md) - Keep module ownership clear
