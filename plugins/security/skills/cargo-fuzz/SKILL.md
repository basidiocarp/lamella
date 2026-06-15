---
name: cargo-fuzz
description: "Uses cargo-fuzz for Rust projects that need libFuzzer-based fuzzing."
origin: lamella
---
# cargo-fuzz

Use `cargo-fuzz` when the target is a Rust crate managed by Cargo and you want the fastest path to libFuzzer-based fuzzing with sanitizer support.

## When to Use

- Cargo-managed Rust projects
- Fast local fuzzing setup
- Structure-aware fuzzing with `arbitrary`
- Coverage or crash reproduction in a Rust-native workflow

## Quick Start

```rust
#![no_main]
use libfuzzer_sys::fuzz_target;

fn harness(data: &[u8]) {
    target_function(data);
}

fuzz_target!(|data: &[u8]| {
    harness(data);
});
```

```bash
cargo fuzz init
cargo +nightly fuzz run fuzz_target_1
```

## Core Workflow

1. Move fuzzable logic into `src/lib.rs`.
2. Run `cargo fuzz init`.
3. Keep harnesses deterministic and panic only on real bugs.
4. Add seeds, dictionaries, or `arbitrary` only when coverage stalls.
5. Re-run saved crashes and generate coverage before closing a campaign.

## Useful Commands

```bash
# Basic run
cargo +nightly fuzz run fuzz_target_1

# Disable sanitizers for safe Rust only
cargo +nightly fuzz run --sanitizer none fuzz_target_1

# Re-run a saved crash
cargo +nightly fuzz run fuzz_target_1 fuzz/artifacts/fuzz_target_1/crash-<hash>

# Show libFuzzer options
cargo +nightly fuzz run fuzz_target_1 -- -help=1
```

## References

- [references/aflpp-custom-fuzzer.md](references/aflpp-custom-fuzzer.md)
- [references/libfuzzer-examples.md](references/libfuzzer-examples.md)
- [references/coverage-advanced-usage.md](references/coverage-advanced-usage.md)
- [references/tool-specific.md](references/tool-specific.md)
