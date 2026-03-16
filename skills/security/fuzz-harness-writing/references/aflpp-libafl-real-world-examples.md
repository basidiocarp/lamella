# Real-World LibAFL Examples

Complete examples for fuzzing real libraries and projects.

## Example: libpng

Fuzzing libpng using LibAFL:

**1. Get source code:**
```bash
curl -L -O https://downloads.sourceforge.net/project/libpng/libpng16/1.6.37/libpng-1.6.37.tar.xz
tar xf libpng-1.6.37.tar.xz
cd libpng-1.6.37/
apt install zlib1g-dev
```

**2. Set compiler wrapper:**
```bash
export FUZZER_CARGO_DIR="/path/to/libafl/project"
export CC=$FUZZER_CARGO_DIR/target/release/libafl_cc
export CXX=$FUZZER_CARGO_DIR/target/release/libafl_cxx
```

**3. Build static library:**
```bash
./configure --enable-shared=no
make
```

**4. Get harness:**
```bash
curl -O https://raw.githubusercontent.com/glennrp/libpng/f8e5fa92b0e37ab597616f554bee254157998227/contrib/oss-fuzz/libpng_read_fuzzer.cc
```

**5. Link fuzzer:**
```bash
$CXX libpng_read_fuzzer.cc .libs/libpng16.a -lz -o fuzz
```

**6. Prepare seeds:**
```bash
mkdir seeds/
curl -o seeds/input.png https://raw.githubusercontent.com/glennrp/libpng/acfd50ae0ba3198ad734e5d4dec2b05341e50924/contrib/pngsuite/iftp1n3p08.png
```

**7. Get dictionary (optional):**
```bash
curl -O https://raw.githubusercontent.com/glennrp/libpng/2fff013a6935967960a5ae626fc21432807933dd/contrib/oss-fuzz/png.dict
```

**8. Start fuzzing:**
```bash
./fuzz --input seeds/ --cores 0 -x png.dict
```

## Example: CMake Project

Integrate LibAFL with CMake build system:

**CMakeLists.txt:**
```cmake
project(BuggyProgram)
cmake_minimum_required(VERSION 3.0)

add_executable(buggy_program main.cc)

add_executable(fuzz main.cc harness.cc)
target_compile_definitions(fuzz PRIVATE NO_MAIN=1)
target_compile_options(fuzz PRIVATE -g -O2)
```

**Build non-instrumented binary:**
```bash
cmake -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ .
cmake --build . --target buggy_program
```

**Build fuzzer:**
```bash
export FUZZER_CARGO_DIR="/path/to/libafl/project"
cmake -DCMAKE_C_COMPILER=$FUZZER_CARGO_DIR/target/release/libafl_cc \
      -DCMAKE_CXX_COMPILER=$FUZZER_CARGO_DIR/target/release/libafl_cxx .
cmake --build . --target fuzz
```

**Run fuzzing:**
```bash
./fuzz --input seeds/ --cores 0
```

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| No coverage increases | Instrumentation failed | Verify compiler wrapper used, check for `-fsanitize-coverage` |
| Fuzzer won't start | Empty corpus with no interesting inputs | Provide seed inputs that trigger code paths |
| Linker errors with `libafl_main` | Runtime not linked | Use `-Wl,--whole-archive` or `-u libafl_main` |
| LLVM version mismatch | LibAFL requires LLVM 15-18 | Install compatible LLVM version, set environment variables |
| Rust compilation fails | Outdated Rust or Cargo | Update Rust with `rustup update` |
| Slow fuzzing | Sanitizers enabled | Expected 2-5x slowdown, necessary for finding bugs |
| Environment variable interference | `CC`, `CXX`, `RUSTFLAGS` set | Unset after building LibAFL project |
| Cannot attach debugger | Multi-process fuzzing | Run in single-process mode |
