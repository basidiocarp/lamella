# Writing a Custom Fuzzer

> **See Also:** For detailed harness writing techniques, patterns for handling complex inputs,
> and advanced strategies, see the **fuzz-harness-writing** technique skill.

## Fuzzer Components

A LibAFL fuzzer consists of modular components:

1. **Observers** - Collect execution feedback (coverage, timing)
2. **Feedback** - Determine if inputs are interesting
3. **Objective** - Define fuzzing goals (crashes, timeouts)
4. **State** - Maintain corpus and metadata
5. **Mutators** - Generate new inputs
6. **Scheduler** - Select which inputs to mutate
7. **Executor** - Run the target with inputs

## Basic Fuzzer Structure

```rust
use libafl::prelude::*;
use libafl_bolts::prelude::*;
use libafl_targets::{libfuzzer_test_one_input, std_edges_map_observer};

#[no_mangle]
// ... (81 lines trimmed)
        .launch()
        .unwrap();
}
```
