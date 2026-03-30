# doc-question-mark

> Document non-obvious use of `?` or propagation-heavy APIs only when callers need the contract

Explain error propagation behavior where it affects API expectations.

## Prefer

- docs on what kinds of failures propagate out of a public function
- focusing on caller-visible behavior instead of syntax trivia
- examples when propagation semantics are easier to show than to describe

## Avoid

- teaching the `?` operator itself in API docs
- documenting propagation details that are irrelevant to callers
- confusing implementation notes with API contract

## See Also

- [err-question-mark](./err-question-mark.md) - Use `?` for straightforward propagation
- [doc-errors-section](./doc-errors-section.md) - Document caller-visible failures
