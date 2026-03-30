# anti-empty-catch

> Don't silently ignore errors

Do not swallow errors without an explicit reason.

## Prefer

- handling, logging, or intentionally downgrading errors with clear intent
- comments when an error is deliberately ignored and safe to ignore
- preserving the signal when the failure may matter later

## Avoid

- empty `if let Err(_) = ... {}` or equivalent silent discard
- treating recoverable failure as irrelevant by default
- broad ignore patterns that hide real regressions

## See Also

- [err-context-chain](./err-context-chain.md) - Keep failures explainable
- [err-result-over-panic](./err-result-over-panic.md) - Return errors instead of hiding them
