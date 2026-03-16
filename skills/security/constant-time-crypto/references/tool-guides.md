# Constant-Time Analysis Tool Guides

## Dudect - Statistical Analysis

[Dudect](https://github.com/oreparaz/dudect/) measures execution time for two input classes (fixed vs random) and uses Welch's t-test to detect statistically significant differences.

### Complete Setup

```c
#define DUDECT_IMPLEMENTATION
#include "dudect.h"

uint8_t do_one_computation(uint8_t *data) {
    // Code to measure goes here
// ... (10 lines trimmed)
        }
    }
}
```

### Key Advantages

- Simple C header-only integration
- Statistical rigor via Welch's t-test
- Works with compiled binaries (real-world conditions)

### Key Limitations

- No root cause information when leak detected
- Sensitive to measurement noise
- Cannot guarantee absence of leaks (statistical confidence only)

### CI Integration Example

```yaml
# .github/workflows/ct-test.yml
name: Constant-Time Tests

on: [push, pull_request]

// ... (8 lines trimmed)
      - name: Run constant-time test
        run: |
          timeout 600 ./ct_test || (echo "Timing leak detected!" && exit 1)
```

---

## Timecop - Dynamic Tracing

[Timecop](https://post-apocalyptic-crypto.org/timecop/) wraps Valgrind to detect runtime operations dependent on secret memory regions.

### Complete Setup

```c
#include "valgrind/memcheck.h"

#define poison(addr, len) VALGRIND_MAKE_MEM_UNDEFINED(addr, len)
#define unpoison(addr, len) VALGRIND_MAKE_MEM_DEFINED(addr, len)

// ... (9 lines trimmed)

    unpoison(&secret_key, sizeof(secret_key));
}
```

### Running Analysis

```bash
valgrind --leak-check=full --track-origins=yes ./binary
```

### Output Interpretation

Valgrind will report:
```
Conditional jump or move depends on uninitialised value(s)
  at 0x40115D: mod_exp (example.c:14)
```

This pinpoints the exact line causing the timing leak.

### Key Advantages

- Pinpoints exact line of timing leak
- No code instrumentation required
- Tracks secret propagation through execution

### Key Limitations

- Cannot detect microarchitecture timing differences
- Coverage limited to executed paths
- Performance overhead (runs on synthetic CPU)

---

## Formal Tools Overview

### ct-verif

Formal verification for LLVM bytecode. Proves absence of leaks mathematically.

```bash
# Install ct-verif
git clone https://github.com/imdea-software/verifying-constant-time.git
cd verifying-constant-time
make

# Verify a function
ct-verif --function=crypto_sign bitcode.bc
```

### SideTrail

AWS s2n-tls's constant-time verification tool.

```bash
# Located in s2n-tls repo
cd tests/sidetrail
./sidetrail.py --function=s2n_hmac_update
```

### FaCT

Domain-specific language for constant-time cryptography.

```fact
secret uint64 key;
public uint64 data;

// FaCT enforces constant-time at compile time
let result = ct_select(key > 0, data, 0);
```

---

## Tool Selection Matrix

| Scenario | Primary Tool | Secondary | Notes |
|----------|-------------|-----------|-------|
| Quick check | dudect | - | Start here always |
| Root cause | Timecop | objdump | After dudect finds leak |
| High assurance | ct-verif | SideTrail | Formal proof |
| CI pipeline | dudect | - | 5-10 min timeout |
| Cache timing | Binsec | pitchfork | Symbolic execution |
