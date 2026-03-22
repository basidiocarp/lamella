# Compilation

## Verbose Mode

Manually specify all instrumentation flags:

```bash
clang++-15 -DNO_MAIN -g -O2 \
  -fsanitize-coverage=trace-pc-guard \
  -fsanitize=address \
  -Wl,--whole-archive target/release/libmy_fuzzer.a -Wl,--no-whole-archive \
  main.cc harness.cc -o fuzz
```

## Compiler Wrapper (Recommended)

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

**Compile and use:**
```bash
cargo build --release
target/release/libafl_cxx -DNO_MAIN -g -O2 main.cc harness.cc -o fuzz
```

> **See Also:** For detailed sanitizer configuration, common issues, and advanced flags,
> see the **address-sanitizer** and **undefined-behavior-sanitizer** technique skills.
