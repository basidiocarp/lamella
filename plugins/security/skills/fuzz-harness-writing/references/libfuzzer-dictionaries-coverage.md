# Fuzzing Dictionary

Dictionaries help the fuzzer discover interesting inputs faster by providing hints about the input format.

## Dictionary Format

Create a text file with quoted strings (one per line):

```conf
# Lines starting with '#' are comments

# Magic bytes
magic="\x89PNG"
magic2="IEND"

# Keywords
"GET"
"POST"
"Content-Type"

# Hex sequences
delimiter="\xFF\xD8\xFF"
```

## Using a Dictionary

```bash
./fuzz -dict=./format.dict corpus/
```

## Generating a Dictionary

**From header files:**
```bash
grep -o '".*"' header.h > header.dict
```

**From man pages:**
```bash
man curl | grep -oP '^\s*(--|-)\K\S+' | sed 's/[,.]$//' | sed 's/^/"&/; s/$/&"/' | sort -u > man.dict
```

**From binary strings:**
```bash
strings ./binary | sed 's/^/"&/; s/$/&"/' > strings.dict
```

**Using LLMs:** Ask ChatGPT or similar to generate a dictionary for your format (e.g., "Generate a libFuzzer dictionary for a JSON parser").

> **See Also:** For advanced dictionary generation, format-specific dictionaries, and
> dictionary optimization strategies, see the **fuzzing-dictionaries** technique skill.

---

# Coverage Analysis

While libFuzzer shows basic coverage stats (`cov: N`), detailed coverage analysis requires additional tools.

## Source-Based Coverage

**1. Recompile with coverage instrumentation:**
```bash
clang++ -fsanitize=fuzzer -fprofile-instr-generate -fcoverage-mapping harness.cc target.cc -o fuzz
```

**2. Run fuzzer to collect coverage:**
```bash
LLVM_PROFILE_FILE="coverage-%p.profraw" ./fuzz -runs=10000 corpus/
```

**3. Merge coverage data:**
```bash
llvm-profdata merge -sparse coverage-*.profraw -o coverage.profdata
```

**4. Generate coverage report:**
```bash
llvm-cov show ./fuzz -instr-profile=coverage.profdata
```

**5. Generate HTML report:**
```bash
llvm-cov show ./fuzz -instr-profile=coverage.profdata -format=html > coverage.html
```

## Improving Coverage

**Tips:**
- Provide better seed inputs in corpus
- Use dictionaries for format-aware fuzzing
- Check if harness properly exercises target
- Consider structure-aware fuzzing for complex formats
- Run longer campaigns (days/weeks)

> **See Also:** For detailed coverage analysis techniques, identifying coverage gaps,
> systematic coverage improvement, and comparing coverage across fuzzers, see the
> **fuzz-coverage-analysis** technique skill.
