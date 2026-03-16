# Execute Runtime for Coverage

C++ runtime to execute corpus files for coverage measurement.

## Full Implementation

```cpp
// execute-rt.cc
#include <stdio.h>
#include <stdlib.h>
#include <dirent.h>
#include <stdint.h>
// ... (56 lines trimmed)
    closedir(dir);
    return 0;
}
```

## With Fork Isolation (Handles Crashing Inputs)

```cpp
#include <sys/wait.h>

int main(int argc, char **argv) {
    // ... directory opening code ...

// ... (13 lines trimmed)
        }
    }
}
```

## Usage

```bash
# Build with coverage instrumentation
clang++ -fprofile-instr-generate -fcoverage-mapping \
  -O2 -DNO_MAIN \
  main.cc harness.cc execute-rt.cc -o fuzz_exec

# Execute corpus
LLVM_PROFILE_FILE=fuzz.profraw ./fuzz_exec corpus/
```
