# Common Coverage Patterns

## Pattern: Identifying Magic Values

**Problem**: Fuzzer cannot discover paths guarded by magic value checks.

**Coverage reveals:**
```cpp
// Coverage shows this block is never executed
if (buf == 0x7F454C46) {  // ELF magic number
    // start parsing buf
}
```

**Solution**: Add magic values to dictionary file:
```
# magic.dict
"\x7F\x45\x4C\x46"
```

---

## Pattern: Handling Crashing Inputs

**Problem**: Coverage generation fails when corpus contains crashing inputs.

**Before:**
```bash
./fuzz_exec corpus/  # Crashes on bad input, no coverage generated
```

**After** (use fork isolation):
```cpp
// Fork before executing to isolate crashes
int main(int argc, char **argv) {
    // ... directory opening code ...

    while ((entry = readdir(dir)) != NULL) {
        pid_t pid = fork();
        if (pid == 0) {
            run_input(entry->d_name);
            _exit(0);
        }

        int status = 0;
        waitpid(pid, &status, 0);
        if (WIFSIGNALED(status)) {
            fprintf(stderr, "crash on %s\n", entry->d_name);
        }
    }
}
```

---

## Pattern: Processing Coverage Data

### LLVM Workflow

```bash
# Merge raw profile data
llvm-profdata merge -sparse fuzz.profraw -o fuzz.profdata

# Generate text report
llvm-cov report ./fuzz_exec \
  -instr-profile=fuzz.profdata \
  -ignore-filename-regex='harness.cc|execute-rt.cc'

# Generate HTML report
llvm-cov show ./fuzz_exec \
  -instr-profile=fuzz.profdata \
  -ignore-filename-regex='harness.cc|execute-rt.cc' \
  -format=html -output-dir fuzz_html/
```

### GCC Workflow with gcovr

```bash
# Install gcovr (via pip for latest version)
python3 -m venv venv
source venv/bin/activate
pip3 install gcovr

# Generate report
gcovr --gcov-executable "llvm-cov gcov" \
  --exclude harness.cc --exclude execute-rt.cc \
  --root . --html-details -o coverage.html
```

---

## Pattern: Analyzing Results

Review the coverage report to identify:

- **Uncovered code blocks**: Areas needing better seed inputs or dictionary entries
- **Magic value checks**: Conditional statements with hardcoded values blocking progress
- **Dead code**: Functions not reachable through your harness
- **Coverage changes**: Compare against baseline to track improvements/regressions
