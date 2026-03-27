# Custom Fuzzer Development Guide

Complete guide for building custom fuzzers using LibAFL as a Rust library.

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
pub extern "C" fn libafl_main() {
    let mut edges = std_edges_map_observer("edges");
    let feedback = MaxMapFeedback::new(&mut edges);
    let objective = CrashFeedback::new();
    let mut mgr = SimpleEventManager::printing();
    let mut state = StdState::new(
        StdRand::with_seed(current_nanos()),
        InMemoryCorpus::new(),
        OnDiskCorpus::new("crashes").unwrap(),
        &feedback,
        &objective,
    )
    .unwrap();

    let mut scheduler = QueueScheduler::new();
    let mut fuzzer = StdFuzzer::new(scheduler, feedback, objective);
    let mut executor = InProcessExecutor::new(
        &mut |input: &BytesInput| {
            libfuzzer_test_one_input(input.target_bytes().as_slice());
            ExitKind::Ok
        },
        tuple_list!(edges),
        &mut fuzzer,
        &mut state,
        &mut mgr,
    )
    .unwrap();

    state
        .load_initial_inputs(&mut fuzzer, &mut executor, &mut mgr, &["seeds"])
        .unwrap();

    let mut stages = tuple_list!(StdMutationalStage::new(
        StdScheduledMutator::new(havoc_mutations())
    ));

    fuzzer.fuzz_loop(&mut stages, &mut executor, &mut state, &mut mgr).unwrap();
}
```

## Compiler Wrapper

Create a LibAFL compiler wrapper to handle instrumentation automatically.

**Create `src/bin/libafl_cc.rs`:**
```rust
use libafl_cc::{ClangWrapper, CompilerWrapper, Configuration, ToolWrapper};

pub fn main() {
    let args: Vec<String> = env::args().collect();
    let mut cc = ClangWrapper::new();
    cc.cpp(is_cpp)
      .parse_args(&args)
      .link_staticlib(&dir, "my_fuzzer")
      .add_args(&Configuration::GenerateCoverageMap.to_flags().unwrap())
      .add_args(&Configuration::AddressSanitizer.to_flags().unwrap())
      .run()
      .unwrap();
}
```

## Crash Deduplication

Avoid storing duplicate crashes from the same bug:

**Add backtrace observer:**
```rust
let backtrace_observer = BacktraceObserver::owned(
    "BacktraceObserver",
    libafl::observers::HarnessType::InProcess
);
```

**Update executor:**
```rust
let mut executor = InProcessExecutor::with_timeout(
    &mut harness,
    tuple_list!(edges_observer, time_observer, backtrace_observer),
    &mut fuzzer,
    &mut state,
    &mut restarting_mgr,
    timeout,
)?;
```

**Update objective with hash feedback:**
```rust
let mut objective = feedback_and!(
    feedback_or_fast!(CrashFeedback::new(), TimeoutFeedback::new()),
    NewHashFeedback::new(&backtrace_observer)
);
```

## Dictionary Fuzzing

Use dictionaries to guide fuzzing toward specific tokens:

**Add tokens from file:**
```rust
let mut tokens = Tokens::new();
if let Some(tokenfile) = &tokenfile {
    tokens.add_from_file(tokenfile)?;
}
state.add_metadata(tokens);
```

**Update mutator:**
```rust
let mutator = StdScheduledMutator::new(
    havoc_mutations().merge(tokens_mutations())
);
```

**Hard-coded tokens example (PNG):**
```rust
state.add_metadata(Tokens::from([
    vec![137, 80, 78, 71, 13, 10, 26, 10], // PNG header
    "IHDR".as_bytes().to_vec(),
    "IDAT".as_bytes().to_vec(),
    "PLTE".as_bytes().to_vec(),
    "IEND".as_bytes().to_vec(),
]));
```

## Auto Tokens

Automatically extract magic values and checksums from the program:

**Enable in compiler wrapper:**
```rust
cc.add_pass(LLVMPasses::AutoTokens)
```

**Load auto tokens in fuzzer:**
```rust
tokens += libafl_targets::autotokens()?;
```

**Verify tokens section:**
```bash
echo "p (uint8_t *)__token_start" | gdb fuzz
```
