# Atheris Docker Environment Setup

Use a Docker environment when local Python, Clang, and sanitizer setup is too
inconsistent for reliable Atheris runs.

## What the Container Should Provide

- Python
- Clang toolchain
- sanitizer-compatible build flags
- any native dependencies needed by the target library

The container should make the fuzzing environment reproducible, not clever.

## Good Uses

- fuzzing Python C extensions
- sharing a known-good fuzzing setup across machines
- avoiding local linker and sanitizer drift

## Operational Rule

If the goal is to fuzz a native-backed Python library, make sure the extension
is built from source inside the instrumented environment. Prebuilt wheels bypass
the instrumentation you need.
