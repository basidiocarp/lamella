# Atheris Real-World Examples

Use Atheris when fuzzing Python code or Python-wrapped native code.

## Good Atheris Targets

- pure Python parsers
- request or message decoders
- libraries with structured input formats
- Python bindings over native code

## Core Pattern

The harness should:
- instrument imports early
- expose one `TestOneInput`-style entrypoint
- keep parsing or target logic narrow

For structured formats, dictionaries and small seed corpora help the fuzzer
reach interesting states faster.

## Performance Guidance

Useful tuning knobs:
- smaller initial `max_len`
- parallel workers and jobs
- sanitizer options that trade speed for better diagnostics

Use them only after the harness itself is stable and deterministic.

## Troubleshooting Rule

If coverage is flat, first check:
- whether the target module was instrumented
- whether imports happened before instrumentation
- whether the corpus is too weak or the input limit too large

Fix the harness shape before adding more fuzzing infrastructure.
