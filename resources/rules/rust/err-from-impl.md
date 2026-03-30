# err-from-impl

> Implement `From` for error conversions you want `?` to use automatically

Use `From` when one error should naturally upcast into another.

## Prefer

- `From<LowerError> for HigherError` when `?` should convert automatically
- conversions that preserve meaning, not just text
- explicit context when conversion alone would be ambiguous

## Avoid

- manual `map_err` everywhere for routine error promotion
- `From` impls that discard important semantics
- overlapping conversions that make error flow hard to follow

## See Also

- [api-from-not-into](./api-from-not-into.md) - Implement `From` on destination types
- [err-source-chain](./err-source-chain.md) - Preserve underlying causes
