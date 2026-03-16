# Atheris Real-World Examples

## Example: Pure Python Parser

```python
import sys
import atheris
import json

@atheris.instrument_func
// ... (10 lines trimmed)

if __name__ == "__main__":
    main()
```

## Example: HTTP Request Parsing

```python
import sys
import atheris

with atheris.instrument_imports():
    from urllib3 import HTTPResponse
// ... (17 lines trimmed)

if __name__ == "__main__":
    main()
```

## Advanced Usage

### Tips and Tricks

| Tip | Why It Helps |
|-----|--------------|
| Use `atheris.instrument_imports()` early | Ensures all imports are instrumented for coverage |
| Start with small `max_len` | Faster initial fuzzing, gradually increase |
| Use dictionaries for structured formats | Helps fuzzer understand format tokens |
| Run multiple parallel instances | Better coverage exploration |

### Custom Instrumentation

Fine-tune what gets instrumented:
```python
import atheris

# Instrument only specific modules
with atheris.instrument_imports():
    import target_module
# Don't instrument test harness code

def test_one_input(data: bytes):
    target_module.parse(data)
```

### Performance Tuning

| Setting | Impact |
|---------|--------|
| `-max_len=N` | Smaller values = faster execution |
| `-workers=N -jobs=N` | Parallel fuzzing for faster coverage |
| `ASAN_OPTIONS=fast_unwind_on_malloc=0` | Better stack traces, slower execution |

### UndefinedBehaviorSanitizer (UBSan)

Add UBSan to catch additional bugs:
```bash
export CFLAGS="-fsanitize=address,undefined,fuzzer-no-link"
export CXXFLAGS="-fsanitize=address,undefined,fuzzer-no-link"
```

Note: Modify flags in Dockerfile if using containerized setup.

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| No coverage increase | Poor seed corpus or target not instrumented | Add better seeds, verify `instrument_imports()` |
| Slow execution | ASan overhead or large inputs | Reduce `max_len`, use `ASAN_OPTIONS=fast_unwind_on_malloc=1` |
| Import errors | Modules imported before instrumentation | Move imports inside `instrument_imports()` context |
| Segfault without ASan output | Missing `LD_PRELOAD` | Set `LD_PRELOAD` to `asan_with_fuzzer.so` path |
| Build failures | Wrong compiler or missing flags | Verify `CC`, `CFLAGS`, and clang version |

## Common Sanitizer Issues

| Issue | Solution |
|-------|----------|
| `LD_PRELOAD` not set | Export `LD_PRELOAD` to point to `asan_with_fuzzer.so` |
| Memory allocation failures | Set `ASAN_OPTIONS=allocator_may_return_null=1` |
| Leak detection noise | Set `ASAN_OPTIONS=detect_leaks=0` |
| Missing symbolizer | Set `ASAN_SYMBOLIZER_PATH` to `llvm-symbolizer` |
