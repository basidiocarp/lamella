# Advanced Coverage Usage

## Tips and Tricks

| Tip | Why It Helps |
|-----|--------------|
| Use LLVM 18+ with `-show-directory-coverage` | Organizes large reports by directory structure |
| Export to lcov format for better HTML | `llvm-cov export -format=lcov` + `genhtml` provides cleaner reports |
| Compare coverage across campaigns | Store `.profdata` files with timestamps |
| Filter harness code from reports | Use `-ignore-filename-regex` to focus on SUT coverage |
| Automate coverage in CI/CD | Generate reports after scheduled fuzzing runs |
| Use gcovr 5.1+ for Clang 14+ | Older gcovr versions have compatibility issues |

---

## Incremental Coverage Updates

GCC's gcov instrumentation incrementally updates `.gcda` files across multiple runs:

```bash
# First run
./fuzz_exec_gcov corpus_batch_1/
gcovr --html coverage_v1.html

# Second run (adds to existing coverage)
./fuzz_exec_gcov corpus_batch_2/
gcovr --html coverage_v2.html

# Start fresh
gcovr --delete  # Remove .gcda files
./fuzz_exec_gcov corpus/
```

---

## Handling Large Codebases

For projects with hundreds of source files:

**1. Filter by prefix:**
```bash
llvm-cov show ./fuzz_exec -instr-profile=fuzz.profdata /path/to/src/
```

**2. Use directory coverage (LLVM 18+):**
```bash
llvm-cov show -show-directory-coverage -format=html -output-dir html/
```

**3. Generate JSON for programmatic analysis:**
```bash
llvm-cov export -format=lcov > coverage.json
```

---

## Differential Coverage

Compare coverage between two fuzzing campaigns:

```bash
# Campaign 1
LLVM_PROFILE_FILE=campaign1.profraw ./fuzz_exec corpus1/
llvm-profdata merge -sparse campaign1.profraw -o campaign1.profdata

# Campaign 2
LLVM_PROFILE_FILE=campaign2.profraw ./fuzz_exec corpus2/
llvm-profdata merge -sparse campaign2.profraw -o campaign2.profdata

# Compare
llvm-cov show ./fuzz_exec \
  -instr-profile=campaign2.profdata \
  -instr-profile=campaign1.profdata \
  -show-line-counts-or-regions
```

---

## CMake Integration

```cmake
project(FuzzingProject)
cmake_minimum_required(VERSION 3.0)

# Main binary
add_executable(program main.cc)

# Shared library under test
add_library(target_lib STATIC parser.cc)

# Coverage-enabled harness
add_executable(fuzz_exec harness.cc)
target_link_libraries(fuzz_exec PRIVATE target_lib)
target_compile_definitions(fuzz_exec PRIVATE NO_MAIN)
target_compile_options(fuzz_exec PRIVATE -O2 -fprofile-instr-generate -fcoverage-mapping)
target_link_libraries(fuzz_exec -fprofile-instr-generate)
```

Build:
```bash
cmake -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ .
cmake --build . --target fuzz_exec
```
