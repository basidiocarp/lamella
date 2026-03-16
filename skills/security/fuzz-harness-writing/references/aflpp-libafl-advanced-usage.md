# Advanced LibAFL Usage

Performance tuning, debugging, and advanced techniques.

## Tips and Tricks

| Tip | Why It Helps |
|-----|--------------|
| Use `-fork=1 -ignore_crashes=1` | Continue fuzzing after first crash |
| Use `InMemoryOnDiskCorpus` | Persist corpus across restarts |
| Enable TUI with `-tui=1` | Better visualization of progress |
| Use specific LLVM version | Avoid compatibility issues |
| Set `RUSTFLAGS` correctly | Prevent linking errors |

## Performance Tuning

| Setting | Impact |
|---------|--------|
| Multi-core fuzzing | Linear speedup with cores |
| `InMemoryCorpus` | Faster but non-persistent |
| `InMemoryOnDiskCorpus` | Balanced speed and persistence |
| Sanitizers | 2-5x slowdown, essential for bugs |
| Optimization level `-O2` | Balance between speed and coverage |

## Debugging Fuzzer

Run fuzzer in single-process mode for easier debugging:

```rust
// Replace launcher with direct call
run_client(None, SimpleEventManager::new(monitor), 0).unwrap();

// Comment out:
// Launcher::builder()
//     .run_client(&mut run_client)
//     ...
//     .launch()
```

Then debug with GDB:
```bash
gdb --args ./fuzz --cores 0 --input corpus/
```

## Verbose Compilation

Manually specify all instrumentation flags:

```bash
clang++-15 -DNO_MAIN -g -O2 \
  -fsanitize-coverage=trace-pc-guard \
  -fsanitize=address \
  -Wl,--whole-archive target/release/libmy_fuzzer.a -Wl,--no-whole-archive \
  main.cc harness.cc -o fuzz
```

## Interpreting Output

| Output | Meaning |
|--------|---------|
| `corpus: N` | Number of interesting test cases found |
| `objectives: N` | Number of crashes/timeouts found |
| `executions: N` | Total number of target invocations |
| `exec/sec: N` | Current execution throughput |
| `edges: X%` | Code coverage percentage |
| `clients: N` | Number of parallel fuzzing processes |

The fuzzer emits two main event types:
- **UserStats** - Regular heartbeat with current statistics
- **Testcase** - New interesting input discovered
