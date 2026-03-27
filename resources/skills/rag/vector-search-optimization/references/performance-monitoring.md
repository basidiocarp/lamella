# Performance Monitoring

Use this reference to track whether vector search changes actually improve the system.

## Core Metrics

- Query latency by percentile
- Recall against a labeled or replay dataset
- Candidate count before reranking
- Memory footprint and index size
- Throughput under concurrent load

## Monitoring Loop

1. Capture a baseline.
2. Change one retrieval parameter.
3. Measure latency and recall together.
4. Keep the change only if the tradeoff is acceptable.
