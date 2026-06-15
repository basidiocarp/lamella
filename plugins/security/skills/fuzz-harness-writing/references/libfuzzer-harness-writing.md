# Writing a Harness

The libFuzzer harness is the entry point the engine calls for every generated
input. Keep it small, deterministic, and focused on one parser or behavior
surface.

## Minimal Harness

```c++
#include <stddef.h>
#include <stdint.h>

extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size) {
    if (size == 0) {
        return 0;
    }

    target_function(data, size);
    return 0;
}
```

## Basic Guardrails

- Reject obviously invalid sizes before calling deep parsing code.
- Reset global state before each iteration if the target mutates shared state.
- Join threads and release resources before returning.
- Avoid logging, sleeping, or reading from the network or filesystem.
- Return `0` for every non-crashing input.

## Using `FuzzedDataProvider`

Use `FuzzedDataProvider` when the target expects multiple fields instead of a
single byte slice.

```c++
#include <stddef.h>
#include <stdint.h>
#include "FuzzedDataProvider.h"

extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size) {
    FuzzedDataProvider provider(data, size);

    auto mode = provider.ConsumeIntegral<uint8_t>();
    auto count = provider.ConsumeIntegralInRange<size_t>(0, 32);
    auto name = provider.ConsumeRandomLengthString(64);
    auto payload = provider.ConsumeRemainingBytes<uint8_t>();

    target_function(mode, count, name, payload.data(), payload.size());
    return 0;
}
```

Use it when:
- the API takes multiple scalars or strings
- field boundaries matter
- you want deterministic slicing instead of ad hoc casts

## Interleaved Harnesses

One harness can exercise a small family of related operations if the input
format stays simple.

```c++
extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size) {
    FuzzedDataProvider provider(data, size);

    switch (provider.ConsumeIntegralInRange<uint8_t>(0, 2)) {
        case 0:
            parse_message(provider.ConsumeRemainingBytes<uint8_t>().data(), size);
            break;
        case 1:
            validate_message(provider.ConsumeRandomLengthString(128));
            break;
        case 2:
            serialize_message(provider.ConsumeIntegral<uint32_t>());
            break;
    }

    return 0;
}
```

Only do this when the targets share the same domain. If the branches represent
different protocols or unrelated subsystems, split them into separate harnesses.

## Review Checklist

| Check | Why |
|---|---|
| Deterministic behavior | Crashes must reproduce |
| No process exit or abort paths | Fuzzing should continue after non-crash failures |
| No persistent global state | One input should not poison the next |
| No unbounded allocations | Avoid harness-created OOM noise |
| Narrow target surface | Better coverage and corpus quality |

> See also: `common-patterns.md` for casting, structure-aware, and state-reset
> patterns.
