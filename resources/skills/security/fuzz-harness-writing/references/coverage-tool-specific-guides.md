# Tool-Specific Coverage Guides

## libFuzzer

libFuzzer uses LLVM's SanitizerCoverage by default for guiding fuzzing, but you need separate instrumentation for generating reports.

**Build for coverage:**
```bash
clang++ -fprofile-instr-generate -fcoverage-mapping \
  -O2 -DNO_MAIN \
  main.cc harness.cc execute-rt.cc -o fuzz_exec
```

**Execute corpus and generate report:**
```bash
LLVM_PROFILE_FILE=fuzz.profraw ./fuzz_exec corpus/
llvm-profdata merge -sparse fuzz.profraw -o fuzz.profdata
llvm-cov show ./fuzz_exec -instr-profile=fuzz.profdata -format=html -output-dir html/
```

**Integration tips:**
- Don't use `-fsanitize=fuzzer` for coverage builds (conflicts with profile instrumentation)
- Reuse the same harness function (`LLVMFuzzerTestOneInput`) with a different main
- Use `-ignore-filename-regex` to exclude harness code
- Use `-show-instantiation` for template-heavy C++ code

---

## AFL++

AFL++ provides its own coverage feedback mechanism, but for detailed reports use standard LLVM/GCC tools.

**Build for coverage with LLVM:**
```bash
clang++ -fprofile-instr-generate -fcoverage-mapping \
  -O2 main.cc harness.cc execute-rt.cc -o fuzz_exec
```

**Build for coverage with GCC:**
```bash
AFL_USE_ASAN=0 afl-gcc -ftest-coverage -fprofile-arcs \
  main.cc harness.cc execute-rt.cc -o fuzz_exec_gcov
```

**Execute and generate report:**
```bash
# LLVM approach
LLVM_PROFILE_FILE=fuzz.profraw ./fuzz_exec afl_output/queue/
llvm-profdata merge -sparse fuzz.profraw -o fuzz.profdata
llvm-cov report ./fuzz_exec -instr-profile=fuzz.profdata

# GCC approach
./fuzz_exec_gcov afl_output/queue/
gcovr --html-details -o coverage.html
```

**Integration tips:**
- Don't use AFL++'s instrumentation (`afl-clang-fast`) for coverage builds
- AFL++'s `queue/` directory contains your corpus
- Built-in coverage stats useful for real-time monitoring but not detailed analysis

---

## cargo-fuzz (Rust)

cargo-fuzz provides built-in coverage generation using LLVM tools.

**Install prerequisites:**
```bash
rustup toolchain install nightly --component llvm-tools-preview
cargo install cargo-binutils rustfilt
```

**Generate coverage data:**
```bash
cargo +nightly fuzz coverage fuzz_target_1
```

**Create HTML report script:**
```bash
cat <<'EOF' > ./generate_html
#!/bin/sh
FUZZ_TARGET="$1"
shift
SRC_FILTER="$@"
TARGET=$(rustc -vV | sed -n 's|host: ||p')
cargo +nightly cov -- show -Xdemangler=rustfilt \
  "target/$TARGET/coverage/$TARGET/release/$FUZZ_TARGET" \
  -instr-profile="fuzz/coverage/$FUZZ_TARGET/coverage.profdata" \
  -show-line-counts-or-regions -show-instantiations \
  -format=html -o fuzz_html/ $SRC_FILTER
EOF
chmod +x ./generate_html
```

**Generate report:**
```bash
./generate_html fuzz_target_1 src/lib.rs
```

**Integration tips:**
- Always use the nightly toolchain for coverage
- `-Xdemangler=rustfilt` makes function names readable
- Filter by source files to focus on crate code
- Corpus is in `fuzz/corpus/<target>/`

---

## honggfuzz

honggfuzz works with standard LLVM/GCC coverage instrumentation.

**Build for coverage:**
```bash
# Use standard compiler, not honggfuzz compiler
clang -fprofile-instr-generate -fcoverage-mapping \
  -O2 harness.c execute-rt.c -o fuzz_exec
```

**Execute corpus:**
```bash
LLVM_PROFILE_FILE=fuzz.profraw ./fuzz_exec honggfuzz_workspace/
```

**Integration tips:**
- Don't use `hfuzz-clang` for coverage builds
- honggfuzz corpus is typically in a workspace directory
- Use the same LLVM workflow as libFuzzer
