---
name: cpp-testing
description: "Implements C++ testing workflows with GoogleTest and CTest."
origin: lamella
---

# C++ Testing

Use this skill when working on C++ tests, especially in GoogleTest and CTest-based projects.

## When to Use

- writing or fixing unit and integration tests
- setting up `gtest_discover_tests()` or CTest execution
- diagnosing flaky failures
- adding coverage or sanitizer-backed test runs

## Core Rules

1. Follow the red, green, refactor loop.
2. Prefer dependency injection and fakes over hidden globals.
3. Run the narrowest failing test first, then the suite.
4. Use sanitizers and coverage as verification tools, not decoration.

## Core Workflow

1. write or update the failing test
2. run the smallest target or filter that exercises the behavior
3. fix production code minimally
4. rerun broader CTest coverage
5. enable sanitizers or coverage if the failure smells memory- or race-related

## Quick Commands

```shell
ctest --test-dir build --output-on-failure
ctest --test-dir build -R ClampTest
./build/example_tests --gtest_filter=ClampTest.*
```

```powershell
ctest --test-dir build --output-on-failure
ctest --test-dir build -R ClampTest
.\build\example_tests.exe --gtest_filter=ClampTest.*
```

## Guardrails

- keep test code deterministic
- isolate fixtures from shared mutable state
- do not hide flaky behavior behind retries
