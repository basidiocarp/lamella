# Writing a Custom Fuzzer

> **See also:** the broader `fuzz-harness-writing` skill for harness design and corpus strategy.

## Fuzzer Components

LibAFL fuzzers are assembled from observers, feedback, objectives, state, mutators, schedulers, and executors.

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

    let mut fuzzer = StdFuzzer::new(QueueScheduler::new(), feedback, objective);
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

    let mut stages = tuple_list!(StdMutationalStage::new(
        StdScheduledMutator::new(havoc_mutations()),
    ));
    fuzzer.fuzz_loop(&mut stages, &mut executor, &mut state, &mut mgr).unwrap();
}
```
