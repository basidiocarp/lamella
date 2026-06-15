# macOS arm64e Workaround

Use this workaround when CodeQL database creation on Apple Silicon fails because
the traced build and the injected tracing library disagree on `arm64` vs
`arm64e`.

## Strategy

The general strategy is to avoid the architecture mismatch by using one of:
- Homebrew-installed toolchains that do not use the problematic slice
- Rosetta x86_64 execution for the whole tracing path
- a fallback mode when tracing is not viable

## Preferred Order

1. try an arm64-compatible Homebrew compiler path
2. try Rosetta if it is available and acceptable
3. use a fallback build mode if trace-based extraction is still blocked

## When to Stop

If repeated tracing attempts still fail, treat the problem as an environment
constraint instead of looping indefinitely. Surface the fallback options and
their tradeoffs clearly.

## Operational Rule

This workaround exists to get a usable database, not to make macOS tracing
beautiful. Prefer the least fragile path that produces a valid database.
