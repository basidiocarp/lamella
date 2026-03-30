# own-cow-conditional

> Use `Cow<'a, T>` for conditional ownership

Use `Cow` when most callers can borrow but some paths need an owned fallback.

## Prefer

- `Cow` for mostly-borrowed string or slice APIs with occasional allocation
- clear ownership semantics at the boundary
- plain owned or borrowed types when one mode obviously dominates

## Avoid

- `Cow` everywhere as a generic flexibility reflex
- complicated APIs where `Cow` makes type signatures harder than the benefit
- using `Cow` when callers never actually benefit from borrowing

## See Also

- [mem-zero-copy](./mem-zero-copy.md) - Borrow backing data when possible
- [own-borrow-over-clone](./own-borrow-over-clone.md) - Prefer borrowing until ownership is needed
