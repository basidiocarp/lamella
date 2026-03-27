# Observation Logging Details

Log observations silently during the session and write them promptly instead of batching them in memory.

## Core Rules

- append to the persistent log immediately or in the next turn
- always assign observation numbers by scanning the real log file
- append only at the end of the log
- preserve enough context for a future session to act on the note

## Numbering Command

```bash
grep -o '### Observation [0-9]*' log.md | grep -o '[0-9]*' | sort -n | tail -1
```

## Handoff Mode

If persistent storage is unavailable, collect observations into a structured handoff document before the session ends.
