# Automated Unit Test Generation

Analyze source code and generate comprehensive unit tests with proper mocking, assertions, and edge case coverage.

## Requirements

$ARGUMENTS

## Instructions

### 1. Analyze Code Under Test

- Identify all public functions, methods, and classes
- Map input types, return types, and side effects
- Find external dependencies that need mocking
- Note conditional branches and error paths

### 2. Generate Test Structure

Follow the project's existing test conventions. If none exist:

- Python: pytest with fixtures in `conftest.py`
- JavaScript/TypeScript: Jest or Vitest with `describe`/`it` blocks
- Go: Table-driven tests with `testing.T`
- Rust: `#[cfg(test)]` modules with `#[test]` functions

### 3. Write Tests for Each Public Function

For each function, generate:

Happy path test -- valid inputs produce expected outputs.

Edge cases -- empty inputs, boundary values, nil/null/None arguments.

Error paths -- invalid inputs raise appropriate exceptions or return errors.

Side effect verification -- mocked dependencies called with correct arguments.

### 4. Apply Framework-Specific Patterns

Python (pytest):```python
@pytest.fixture
def instance():
    return MyClass(dependency=Mock())

def test_method_success(instance):
    result = instance.method(valid_input)
    assert result == expected

def test_method_invalid_input(instance):
    with pytest.raises(ValueError, match="specific message"):
        instance.method(invalid_input)
```

TypeScript (Jest):```typescript
describe('functionName', () => {
  it('returns expected result with valid input', () => {
    expect(functionName(validInput)).toBe(expected);
  });

  it('throws on invalid input', () => {
    expect(() => functionName(null)).toThrow();
  });
});
```

### 5. Generate Mocks for Dependencies

Mock external services and I/O at boundaries. Do not mock the code under test.

```python
@pytest.fixture
def mock_repository():
    repo = Mock(spec=UserRepository)
    repo.get.return_value = User(id="1", name="Test")
    return repo
```

### 6. Identify Coverage Gaps

After generating tests, note any untested paths:
- Uncovered branches in conditionals
- Missing error scenarios
- Untested edge cases in complex logic

## Output

1. Complete test files ready to run
2. Mock/fixture setup for external dependencies
3. List of coverage gaps that need manual review
