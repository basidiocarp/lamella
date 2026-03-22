# Corpus Management

## Creating Initial Corpus

Create a directory for the corpus (can start empty):

```bash
mkdir corpus/
```

**Optional but recommended:** Provide seed inputs (valid example files):

```bash
# For a PNG parser:
cp examples/*.png corpus/

# For a protocol parser:
cp test_packets/*.bin corpus/
```

**Benefits of seed inputs:**
- Fuzzer doesn't start from scratch
- Reaches valid code paths faster
- Significantly improves effectiveness

## Corpus Structure

The corpus directory contains:
- Input files that trigger unique code paths
- Minimized versions (libFuzzer automatically minimizes)
- Named by content hash (e.g., `a9993e364706816aba3e25717850c26c9cd0d89d`)

## Corpus Minimization

libFuzzer automatically minimizes corpus entries during fuzzing. To explicitly minimize:

```bash
mkdir minimized_corpus/
./fuzz -merge=1 minimized_corpus/ corpus/
```

This creates a deduplicated, minimized corpus in `minimized_corpus/`.

> **See Also:** For corpus creation strategies, seed selection, format-specific corpus building,
> and corpus maintenance, see the **fuzzing-corpus** technique skill.
