# test-arrange-act-assert

> Structure tests with clear Arrange, Act, Assert sections

Keep test flow easy to scan.

## Prefer

- grouping setup, execution, and assertions in that order
- blank lines or short comments when they improve scanability
- one behavioral focus per test

## Avoid

- interleaving setup and assertions until intent is hard to read
- large helper-heavy tests that hide the actual behavior under test
- comment noise when the structure is already obvious

## See Also

- [test-descriptive-names](./test-descriptive-names.md) - Name the behavior clearly
- [test-cfg-test-module](./test-cfg-test-module.md) - Keep unit tests near the code
