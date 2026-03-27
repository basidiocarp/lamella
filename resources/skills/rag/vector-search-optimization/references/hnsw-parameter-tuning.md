# HNSW Parameter Tuning

Use this reference when HNSW settings are the main retrieval lever.

## Main Parameters

- `M`: graph connectivity and memory cost
- `ef_construction`: build-time search depth
- `ef_search`: query-time recall versus latency

## Tuning Order

1. Pick sane defaults for the dataset size.
2. Benchmark recall and latency at multiple `ef_search` levels.
3. Increase `M` only if recall targets remain out of reach.
4. Re-test after any quantization or embedding-model change.
