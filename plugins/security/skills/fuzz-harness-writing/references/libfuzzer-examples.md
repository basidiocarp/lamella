# Real-World Examples

## Example 1: Fuzzing libpng

libpng is a widely-used library for reading/writing PNG images. Bugs can lead to security issues.

**1. Get source code:**
```bash
curl -L -O https://downloads.sourceforge.net/project/libpng/libpng16/1.6.37/libpng-1.6.37.tar.xz
tar xf libpng-1.6.37.tar.xz
cd libpng-1.6.37/
```

**2. Install dependencies:**
```bash
apt install zlib1g-dev
```

**3. Compile with fuzzing instrumentation:**
```bash
export CC=clang CFLAGS="-fsanitize=fuzzer-no-link -fsanitize=address"
export CXX=clang++ CXXFLAGS="$CFLAGS"
./configure --enable-shared=no
make
```

**4. Get a harness (or write your own):**
```bash
curl -O https://raw.githubusercontent.com/glennrp/libpng/f8e5fa92b0e37ab597616f554bee254157998227/contrib/oss-fuzz/libpng_read_fuzzer.cc
```

**5. Prepare corpus and dictionary:**
```bash
mkdir corpus/
curl -o corpus/input.png https://raw.githubusercontent.com/glennrp/libpng/acfd50ae0ba3198ad734e5d4dec2b05341e50924/contrib/pngsuite/iftp1n3p08.png
curl -O https://raw.githubusercontent.com/glennrp/libpng/2fff013a6935967960a5ae626fc21432807933dd/contrib/oss-fuzz/png.dict
```

**6. Link and compile fuzzer:**
```bash
clang++ -fsanitize=fuzzer -fsanitize=address libpng_read_fuzzer.cc .libs/libpng16.a -lz -o fuzz
```

**7. Run fuzzing campaign:**
```bash
./fuzz -close_fd_mask=3 -dict=./png.dict corpus/
```

## Example 2: Simple Division Bug

Harness that finds a division-by-zero bug:

```c++
#include <stdint.h>
#include <stddef.h>

double divide(uint32_t numerator, uint32_t denominator) {
    // Bug: No check if denominator is zero
    return numerator / denominator;
}

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    if (size < 8) return 0;

    uint32_t numerator = *(const uint32_t *)(data);
    uint32_t denominator = *(const uint32_t *)(data + 4);
    (void)divide(numerator, denominator);

    return 0;
}
```

Compile and fuzz:
```bash
clang++ -fsanitize=fuzzer harness.cc -o fuzz
./fuzz
```

The fuzzer will quickly find inputs causing a crash.
