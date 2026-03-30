# test-doctest-examples

> Keep documentation examples as executable doctests

Use doctests when examples should stay correct as the API evolves.

## Prefer

- real examples in docs that compile and run
- short examples that show the happy path clearly
- hidden setup only when it keeps the example readable without becoming magical

## Avoid

- prose examples that can silently go stale
- large doctests that are really integration tests in disguise
- examples that skip important imports or setup unless hidden lines provide them

## See Also

- [doc-examples-section](./doc-examples-section.md) - Structure example sections clearly
- [test-integration-dir](./test-integration-dir.md) - Move larger scenarios into integration tests
