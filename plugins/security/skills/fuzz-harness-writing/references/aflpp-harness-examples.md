# AFL++ Harness Examples

## Basic Harness Structure

```c++
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    if (size < MIN_SIZE || size > MAX_SIZE) return 0;
    target_function(data, size);
    return 0;
}
```

## Argument Fuzzing

```c++
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#ifdef __AFL_COMPILER
  #include "argv-fuzz-inl.h"
#endif

int main(int argc, char **argv) {
    AFL_INIT_ARGV();

    if (argc < 2) {
        return 0;
    }

    const char *input_buf = argv[1];
    size_t len = strlen(input_buf);
    check_buf(input_buf, len);
    return 0;
}
```

Download the helper header:

```bash
curl -O https://raw.githubusercontent.com/AFLplusplus/AFLplusplus/stable/utils/argv_fuzzing/argv-fuzz-inl.h
```

Compile and run:

```bash
./afl++ <host/docker> afl-clang-fast++ -O2 main_arg.c -o fuzz_arg
./afl++ <host/docker> afl-fuzz -i seeds -o out -- ./fuzz_arg
```
