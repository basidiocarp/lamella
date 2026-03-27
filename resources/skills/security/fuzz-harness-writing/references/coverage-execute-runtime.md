# Execute Runtime for Coverage

Use a small execute-runtime binary when you need to replay a corpus and collect
coverage from real harness inputs.

## Purpose

The runtime should:
- iterate over corpus files
- feed them into the target or harness entrypoint
- optionally isolate crashes with fork-based execution
- emit coverage artifacts for later reporting

## When to Use It

Good fits:
- measuring corpus quality
- validating whether new seeds exercise more code
- replaying crashing or interesting inputs outside the fuzz loop

## Design Rule

Keep the runtime minimal. It exists to execute corpus inputs and gather
coverage, not to become another full fuzz harness.

## Isolation

Use fork isolation when crashing inputs should not stop the whole replay run.
This is especially useful when evaluating mixed-quality corpora.
