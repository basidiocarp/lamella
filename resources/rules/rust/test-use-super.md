# test-use-super

> Use `use super::*;` in test modules to access parent module items

In unit test modules, prefer `use super::*;` to keep local tests concise.

## Prefer

- `use super::*;` in `#[cfg(test)] mod tests`
- extra imports only for external helpers or traits
- local readability over repeated `crate::module::...` paths

## Avoid

- reaching multiple layers outward when the test probably belongs elsewhere
- importing unused names just because `super::*` was copied in blindly
- using this pattern in integration tests under `tests/`

## See Also

- [test-cfg-test-module](./test-cfg-test-module.md) - Keep unit tests near the module
- [test-integration-dir](./test-integration-dir.md) - Use public imports in integration tests
