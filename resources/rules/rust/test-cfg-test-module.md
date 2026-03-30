# test-cfg-test-module

> Put unit tests in `#[cfg(test)] mod tests { }` within each module

Keep unit tests close to the implementation they exercise.

## Prefer

- module-local unit tests in `#[cfg(test)] mod tests`
- testing private helpers through nearby tests when that improves coverage and clarity
- integration tests in `tests/` for public API behavior

## Avoid

- scattering unit tests into unrelated files
- reaching across the crate for behavior that should be covered as an integration test
- duplicating the same unit coverage in both local and integration suites

## See Also

- [test-integration-dir](./test-integration-dir.md) - Put public API tests in `tests/`
- [test-use-super](./test-use-super.md) - Import nearby items simply in unit tests
