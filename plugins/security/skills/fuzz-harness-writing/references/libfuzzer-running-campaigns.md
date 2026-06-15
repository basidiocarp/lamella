# Running Campaigns

## Basic Run

```bash
./fuzz corpus/
```

This runs until a crash is found or you stop it (Ctrl+C).

## Recommended: Continue After Crashes

```bash
./fuzz -fork=1 -ignore_crashes=1 corpus/
```

The `-fork` and `-ignore_crashes` flags (experimental but widely used) allow fuzzing to continue after finding crashes.

## Common Options

**Control input size:**
```bash
./fuzz -max_len=4000 corpus/
```
Rule of thumb: 2x the size of minimal realistic input.

**Set timeout:**
```bash
./fuzz -timeout=2 corpus/
```
Abort test cases that run longer than 2 seconds.

**Use a dictionary:**
```bash
./fuzz -dict=./format.dict corpus/
```

**Close stdout/stderr (speed up fuzzing):**
```bash
./fuzz -close_fd_mask=3 corpus/
```

**See all options:**
```bash
./fuzz -help=1
```

## Multi-Core Fuzzing

**Option 1: Jobs and workers (recommended):**
```bash
./fuzz -jobs=4 -workers=4 -fork=1 -ignore_crashes=1 corpus/
```
- `-jobs=4`: Run 4 sequential campaigns
- `-workers=4`: Process jobs in parallel with 4 processes
- Test cases are shared between jobs

**Option 2: Fork mode:**
```bash
./fuzz -fork=4 -ignore_crashes=1 corpus/
```

**Note:** For serious multi-core fuzzing, consider switching to AFL++, Honggfuzz, or LibAFL.

## Re-executing Test Cases

**Re-run a single crash:**
```bash
./fuzz ./crash-a9993e364706816aba3e25717850c26c9cd0d89d
```

**Test all inputs in a directory without fuzzing:**
```bash
./fuzz -runs=0 corpus/
```

## Interpreting Output

When fuzzing runs, you'll see statistics like:

```
INFO: Seed: 3517090860
INFO: Loaded 1 modules (9 inline 8-bit counters)
#2      INITED cov: 3 ft: 4 corp: 1/1b exec/s: 0 rss: 26Mb
#57     NEW    cov: 4 ft: 5 corp: 2/4b lim: 4 exec/s: 0 rss: 26Mb
```

| Output | Meaning |
|--------|---------|
| `INITED` | Fuzzing initialized |
| `NEW` | New coverage found, added to corpus |
| `REDUCE` | Input minimized while keeping coverage |
| `cov: N` | Number of coverage edges hit |
| `corp: X/Yb` | Corpus size: X entries, Y total bytes |
| `exec/s: N` | Executions per second |
| `rss: NMb` | Resident memory usage |

**On crash:**
```
==11672== ERROR: libFuzzer: deadly signal
artifact_prefix='./'; Test unit written to ./crash-a9993e364706816aba3e25717850c26c9cd0d89d
0x61,0x62,0x63,
abc
Base64: YWJj
```

The crash is saved to `./crash-<hash>` with the input shown in hex, UTF-8, and Base64.

**Reproducibility:** Use `-seed=<value>` to reproduce a fuzzing campaign (single-core only).
