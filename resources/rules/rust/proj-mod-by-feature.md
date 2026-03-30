# proj-mod-by-feature

> Organize modules by feature or domain, not by language construct

Split modules by responsibility callers understand.

## Prefer

- feature or domain modules that group the types and functions that change together
- internal submodules only when a feature area becomes large
- names that reflect business meaning rather than implementation trivia

## Avoid

- top-level `types`, `utils`, `helpers`, or `misc` modules as the primary structure
- module splits by syntax category when the behavior belongs together
- refactors that move code without clarifying ownership

## See Also

- [proj-flat-small](./proj-flat-small.md) - Stay flat while the crate is small
- [proj-pub-use-reexport](./proj-pub-use-reexport.md) - Expose a cleaner public shape than the internal module tree
