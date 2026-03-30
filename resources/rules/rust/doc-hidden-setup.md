# doc-hidden-setup

> Use hidden lines in doctests only to keep examples readable

Hide setup in doctests when it removes noise without making the example magical.

## Prefer

- hidden imports or scaffolding that callers do not need to study
- visible lines for the actual behavior being demonstrated
- enough visible context that the example still feels honest

## Avoid

- hiding the interesting part of the example
- examples that only compile because too much behavior is hidden
- using hidden setup as a substitute for a smaller example

## See Also

- [test-doctest-examples](./test-doctest-examples.md) - Keep doctests runnable
- [doc-examples-section](./doc-examples-section.md) - Use examples when they help
