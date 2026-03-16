---
name: constant-time-crypto
description: >-
  Detect and test timing side-channel vulnerabilities in cryptographic code. Combines static analysis 
  (assembly/bytecode inspection across 12+ languages) with dynamic testing (dudect, timecop, ct-verif). 
  Use when implementing or reviewing crypto code, auditing for timing attacks, or encountering 
  secret-dependent branches, division, or table lookups.
metadata:
  type: domain
  absorbed:
    - constant-time-analysis
    - constant-time-testing
---

# Constant-Time Crypto

Detect and verify constant-time properties in cryptographic implementations through static analysis and dynamic testing.

## Contents

- [When to Use](#when-to-use)
- [Common Violation Patterns](#common-violation-patterns)
- [Quick Reference — Detection & Fixes](#quick-reference--detection--fixes)
- [Static Analysis](#static-analysis)
  - [CLI Analyzer](#cli-analyzer)
  - [Language Guides](#language-guides)
  - [Prerequisites](#prerequisites)
  - [Interpreting Results](#interpreting-results)
  - [Triage — Avoiding False Positives](#triage--avoiding-false-positives)
- [Dynamic Testing](#dynamic-testing)
  - [Testing Workflow](#testing-workflow)
  - [Dudect (Statistical)](#dudect-statistical)
  - [Timecop (Dynamic)](#timecop-dynamic)
  - [Tool Selection](#tool-selection)
- [Vulnerability Severity](#vulnerability-severity)
- [Tips](#tips)
- [Limitations](#limitations)
- [Real-World Impact](#real-world-impact)
- [References](#references)

---

## When to Use

**Concrete triggers:**
- User implements signature, encryption, or key derivation
- Code contains `/` or `%` operators on secret-derived values
- User mentions "constant-time", "timing attack", "side-channel", "KyberSlash"
- Reviewing functions named `sign`, `verify`, `encrypt`, `decrypt`, `derive_key`
- Auditing cryptographic implementations or PRs that touch crypto code
- Code handles secret keys, passwords, or sensitive material

**Do NOT use for**: non-cryptographic code, public data processing, high-level API usage where the library handles timing.

---

## Common Violation Patterns

Four patterns account for most timing vulnerabilities:

```c
// 1. Conditional jumps — most severe
if (secret == 1) { ... }

// 2. Array access — cache-timing attacks
// ... (5 lines trimmed)
// 4. Shift operation (processor dependent)
data = a << secret;
```

---

## Quick Reference — Detection & Fixes

| Problem | Detection | Fix |
|---------|-----------|-----|
| Division on secrets | DIV, IDIV, SDIV, UDIV | Barrett reduction or multiply-by-inverse |
| Branch on secrets | JE, JNE, BEQ, BNE | Constant-time selection (cmov, bit masking) |
| Secret comparison | Early-exit memcmp | Use `crypto/subtle` or constant-time compare |
| Weak RNG | rand(), mt_rand, Math.random | Use crypto-secure RNG |
| Table lookup by secret | Array subscript on secret index | Bit-sliced lookups |

---

## Static Analysis

### CLI Analyzer

```bash
# Analyze any supported file type
uv run {baseDir}/ct_analyzer/analyzer.py <source_file>

# Include conditional branch warnings
// ... (5 lines trimmed)
# JSON output for CI
uv run {baseDir}/ct_analyzer/analyzer.py --json <source_file>
```

**Native compiled languages (C, C++, Go, Rust, Swift):**

```bash
# Cross-architecture testing (RECOMMENDED)
uv run {baseDir}/ct_analyzer/analyzer.py --arch x86_64 crypto.c
uv run {baseDir}/ct_analyzer/analyzer.py --arch arm64 crypto.c

# Multiple optimization levels
uv run {baseDir}/ct_analyzer/analyzer.py --opt-level O0 crypto.c
uv run {baseDir}/ct_analyzer/analyzer.py --opt-level O3 crypto.c
```

**VM-compiled languages (Java, Kotlin, C#):** The analyzer examines bytecode directly. `--arch` and `--opt-level` flags do not apply.

### Language Guides

| Language | File Extensions | Guide |
|----------|----------------|-------|
| C, C++ | `.c`, `.h`, `.cpp`, `.cc`, `.hpp` | [references/compiled.md](references/compiled.md) |
| Go | `.go` | [references/compiled.md](references/compiled.md) |
| Rust | `.rs` | [references/compiled.md](references/compiled.md) |
| Swift | `.swift` | [references/swift.md](references/swift.md) |
| Java | `.java` | [references/vm-compiled.md](references/vm-compiled.md) |
| Kotlin | `.kt`, `.kts` | [references/kotlin.md](references/kotlin.md) |
| C# | `.cs` | [references/vm-compiled.md](references/vm-compiled.md) |
| PHP | `.php` | [references/php.md](references/php.md) |
| JavaScript | `.js`, `.mjs`, `.cjs` | [references/javascript.md](references/javascript.md) |
| TypeScript | `.ts`, `.tsx` | [references/javascript.md](references/javascript.md) |
| Python | `.py` | [references/python.md](references/python.md) |
| Ruby | `.rb` | [references/ruby.md](references/ruby.md) |

### Prerequisites

| Language | Requirements |
|----------|-------------|
| C, C++, Go, Rust | Compiler in PATH (`gcc`/`clang`, `go`, `rustc`) |
| Swift | Xcode or Swift toolchain (`swiftc` in PATH) |
| Java | JDK with `javac` and `javap` in PATH |
| Kotlin | Kotlin compiler (`kotlinc`) + JDK (`javap`) in PATH |
| C# | .NET SDK + `ilspycmd` (`dotnet tool install -g ilspycmd`) |
| PHP | PHP with VLD extension or OPcache |
| JavaScript/TypeScript | Node.js in PATH |
| Python | Python 3.x in PATH |
| Ruby | Ruby with `--dump=insns` support |

**macOS users**: Add keg-only tools to PATH:
```bash
export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"
export PATH="$HOME/.dotnet/tools:$PATH"
```

### Interpreting Results

**PASSED** — No variable-time operations detected.

**FAILED** — Dangerous instructions found:
```text
[ERROR] SDIV
  Function: decompose_vulnerable
  Reason: SDIV has early termination optimization; execution time depends on operand values
```

### Triage — Avoiding False Positives

Not every flagged operation is a vulnerability. The tool has no data flow analysis — it flags ALL potentially dangerous operations.

For each violation, ask: **Does this operation's input depend on secret data?**

1. Identify the secret inputs (private keys, plaintext, signatures, tokens)
2. Trace data flow from flagged instruction back to inputs
3. Common false positive patterns:
   ```c
   // FALSE POSITIVE: Division uses public constant
   int num_blocks = data_len / 16;  // data_len is length, not content
   
   // TRUE POSITIVE: Division involves secret-derived value
   int32_t q = secret_coef / GAMMA2;  // secret_coef from private key
   ```

| Question | If Yes | If No |
|----------|--------|-------|
| Is the operand a compile-time constant? | Likely false positive | Continue |
| Is the operand a public parameter (length, count)? | Likely false positive | Continue |
| Is the operand derived from key/plaintext/secret? | **TRUE POSITIVE** | Likely false positive |
| Can an attacker influence the operand value? | **TRUE POSITIVE** | Likely false positive |

---

## Dynamic Testing

### Testing Workflow

```
1. dudect    → Quick statistical check
      ↓
2. timecop   → If leak found, pinpoint location
      ↓
3. ct-verif  → For high-assurance (optional)
      ↓
4. CI        → Integrate dudect into pipeline
```

### Dudect (Statistical)

```c
#define DUDECT_IMPLEMENTATION
#include "dudect.h"

uint8_t do_one_computation(uint8_t *data) {
    // Code to measure
}
```

Run: `timeout 600 ./ct_test`

### Timecop (Dynamic)

```c
#include "valgrind/memcheck.h"
#define poison(addr, len) VALGRIND_MAKE_MEM_UNDEFINED(addr, len)

poison(&secret_key, sizeof(secret_key));
crypto_operation(secret_key);
```

Run: `valgrind --track-origins=yes ./binary`

### Tool Selection

| Scenario | Recommended Tool |
|----------|-----------------|
| Quick statistical detection | **dudect** |
| Root-cause analysis | **timecop** |
| Formal proof | ct-verif, SideTrail |
| Cache-timing | Binsec, pitchfork |

---

## Vulnerability Severity

| Vulnerability | Detection | Severity |
|---------------|-----------|----------|
| Secret-dependent branch | dudect, timecop, static | CRITICAL |
| Secret-dependent array access | timecop, static | HIGH |
| Variable-time division | timecop, static | MEDIUM |
| Variable-time shift | timecop | MEDIUM |

---

## Tips

| Tip | Why |
|-----|-----|
| Pin to isolated CPU (`taskset -c 2`) | Reduces OS noise in dynamic tests |
| Test multiple compilers & opt levels | Optimizations can introduce leaks |
| Run dudect 5–10+ min | Statistical confidence |
| Check assembly (`objdump -d`) | Verify no hidden branches |
| Test --arch x86_64 AND arm64 | Architecture-specific instructions differ |

---

## Limitations

1. **Static analysis only examines assembly/bytecode**, not runtime behavior. Cannot detect cache timing or microarchitectural side-channels.
2. **No data flow analysis** in static mode — flags all dangerous operations regardless of secret involvement. Manual review required.
3. **Compiler/runtime variations** — different compilers, optimization levels, and runtimes may produce different output.
4. **Dynamic tests require harness code** — dudect and timecop need manual instrumentation.

---

## Real-World Impact

- **KyberSlash (2023)**: Division instructions in post-quantum ML-KEM allowed key recovery
- **Lucky Thirteen (2013)**: Timing differences in CBC padding validation enabled plaintext recovery
- **RSA Timing Attacks**: Early implementations leaked private key bits through division timing
- **OpenSSL RSA**: Non-constant-time modular exponentiation exploited remotely
- **AES Cache Attacks**: T-table lookups leaked key bits through cache timing

---

## References

### Internal References

| File | Description |
|------|-------------|
| [references/compiled.md](references/compiled.md) | C, C++, Go, Rust analysis guide |
| [references/swift.md](references/swift.md) | Swift analysis guide |
| [references/vm-compiled.md](references/vm-compiled.md) | Java, C# bytecode analysis guide |
| [references/kotlin.md](references/kotlin.md) | Kotlin analysis guide |
| [references/php.md](references/php.md) | PHP analysis guide |
| [references/javascript.md](references/javascript.md) | JavaScript/TypeScript analysis guide |
| [references/python.md](references/python.md) | Python analysis guide |
| [references/ruby.md](references/ruby.md) | Ruby analysis guide |
| [references/tool-guides.md](references/tool-guides.md) | Complete setup for dudect, timecop, formal tools |
| [references/vulnerability-patterns.md](references/vulnerability-patterns.md) | Detailed vulnerability patterns and fixes |
| [references/case-studies.md](references/case-studies.md) | OpenSSL RSA, KyberSlash, AES cache attack case studies |

### External Resources

- [Cryptocoding Guidelines](https://github.com/veorq/cryptocoding)
- [KyberSlash](https://kyberslash.cr.yp.to/)
- [BearSSL Constant-Time](https://www.bearssl.org/constanttime.html)
- [Kocher: Timing Attacks (1996)](https://paulkocher.com/doc/TimingAttacks.pdf)
- [CROCS Constant-Time Tools](https://crocs-muni.github.io/ct-tools/)
- [dudect GitHub](https://github.com/oreparaz/dudect/)
```
