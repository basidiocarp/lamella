# Multi-Core Fuzzing with AFL++

AFL++ excels at multi-core fuzzing with two major advantages:
1. More executions per second (scales linearly with physical cores)
2. Asymmetrical fuzzing (e.g., one ASan job, rest without sanitizers)

---

## Starting a Multi-Core Campaign

Start the primary fuzzer (in background):

```bash
./afl++ <host/docker> afl-fuzz -M primary -i seeds -o state -- ./fuzz 1>primary.log 2>primary.error &
```

Start secondary fuzzers (as many as you have cores):

```bash
./afl++ <host/docker> afl-fuzz -S secondary01 -i seeds -o state -- ./fuzz 1>secondary01.log 2>secondary01.error &
./afl++ <host/docker> afl-fuzz -S secondary02 -i seeds -o state -- ./fuzz 1>secondary02.log 2>secondary02.error &
```

---

## Monitoring Multi-Core Campaigns

List all running jobs:

```bash
jobs
```

View live statistics (updates every second):

```bash
./afl++ <host/docker> watch -n1 --color afl-whatsup state/
```

---

## Stopping All Fuzzers

```bash
kill $(jobs -p)
```

---

## Output Directory Structure

```text
out/default/
├── cmdline          # How was the SUT invoked?
├── crashes/         # Inputs that crash the SUT
│   └── id:000000,sig:06,src:000002,time:286,execs:13105,op:havoc,rep:4
├── hangs/           # Inputs that hang the SUT
├── queue/           # Test cases reproducing final fuzzer state
│   ├── id:000000,time:0,execs:0,orig:minimal_seed
│   └── id:000001,src:000000,time:0,execs:8,op:havoc,rep:6,+cov
├── fuzzer_stats     # Campaign statistics
└── plot_data        # Data for plotting
```

---

## Interpreting Output

| Output | Meaning |
|--------|---------|
| **execs/sec** | Execution speed - higher is better |
| **cycles done** | Number of queue passes completed |
| **corpus count** | Number of unique test cases in queue |
| **saved crashes** | Number of unique crashes found |
| **stability** | % of stable edges (should be near 100%) |

---

## Analyzing Results

View live campaign statistics:

```bash
./afl++ <host/docker> afl-whatsup out
```

Create coverage plots:

```bash
apt install gnuplot
./afl++ <host/docker> afl-plot out/default out_graph/
```

Re-execute test cases:

```bash
./afl++ <host/docker> ./fuzz out/default/crashes/<test_case>
```

---

## Performance Tuning

| Setting | Impact |
|---------|--------|
| CPU core count | Linear scaling with physical cores |
| Persistent mode | 10-20x faster than fork server |
| `-G` input size limit | Smaller = faster, but may miss bugs |
| ASan ratio | 1 ASan job per 4-8 non-ASan jobs |
