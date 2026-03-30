# test-descriptive-names

> Use descriptive test names that explain what is being tested

Test names should describe the behavior and expected outcome.

## Prefer

- names that state scenario plus expectation
- language close to the domain or API contract
- consistency with the surrounding test naming style

## Avoid

- names like `test_1`, `works`, or `basic_case`
- names that only restate the function name
- encoding too much incidental setup in the test name

## See Also

- [test-arrange-act-assert](./test-arrange-act-assert.md) - Keep test flow readable
- [test-doctest-examples](./test-doctest-examples.md) - Keep examples descriptive too
