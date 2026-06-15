---
name: vector-search-optimization
description: "Optimizes vector search infrastructure and retrieval quality."
origin: lamella
---

# Vector Search Optimization

## Contents

- [When to Use This Skill](#when-to-use-this-skill)
- [Distance Metrics](#distance-metrics)
- [Index Types](#index-types)
- [HNSW Parameters](#hnsw-parameters)
- [Quantization](#quantization)
- [Quick Reference](#quick-reference)
- [References](#references)
- [Best Practices](#best-practices)
- [Resources](#resources)

Patterns for implementing and optimizing vector search in production systems.

## When to Use This Skill

- Building semantic search systems
- Implementing RAG retrieval pipelines
- Creating recommendation engines
- Tuning HNSW parameters for recall/speed
- Implementing quantization for memory savings
- Scaling to millions or billions of vectors
- Combining semantic and keyword search

## Distance Metrics

| Metric             | Formula            | Best For              |
| ------------------ | ------------------ | --------------------- |
| **Cosine**         | 1 - (A·B)/(‖A‖‖B‖) | Normalized embeddings |
| **Euclidean (L2)** | √Σ(a-b)²           | Raw embeddings        |
| **Dot Product**    | A·B                | Magnitude matters     |
| **Manhattan (L1)** | Σ\|a-b\|             | Sparse vectors        |

## Index Types

```
┌─────────────────────────────────────────────────┐
│                 Index Types                      │
├─────────────┬───────────────┬───────────────────┤
│    Flat     │     HNSW      │    IVF+PQ         │
│ (Exact)     │ (Graph-based) │ (Quantized)       │
├─────────────┼───────────────┼───────────────────┤
│ O(n) search │ O(log n)      │ O(√n)             │
│ 100% recall │ ~95-99%       │ ~90-95%           │
│ Small data  │ Medium-Large  │ Very Large        │
└─────────────┴───────────────┴───────────────────┘
```

### Index Selection

| Data Size | Recommended Index |
|-----------|-------------------|
| < 10K vectors | Flat (exact search) |
| 10K - 1M | HNSW |
| 1M - 100M | HNSW + Quantization |
| > 100M | IVF + PQ or DiskANN |

## HNSW Parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| **M** | 16 | Connections per node, ↑ = better recall, more memory |
| **efConstruction** | 100 | Build quality, ↑ = better index, slower build |
| **efSearch** | 50 | Search quality, ↑ = better recall, slower search |

### Recommended HNSW Params by Scale

| Vectors | M | efConstruction | efSearch (95% recall) |
|---------|---|----------------|----------------------|
| < 100K | 16 | 100 | 64 |
| 100K - 1M | 32 | 200 | 128 |
| > 1M | 48 | 256 | 128-256 |

## Quantization

| Type | Size per Vector | Notes |
|------|-----------------|-------|
| FP32 | 4 × dims bytes | Full precision |
| FP16 | 2 × dims bytes | Half precision |
| INT8 | 1 × dims bytes | Scalar quantization |
| PQ | ~32-64 bytes | Product quantization |
| Binary | dims/8 bytes | Sign only |

### Optimization Targets

| Optimize For | HNSW Config | Quantization |
|--------------|-------------|--------------|
| Recall | M=32, ef=256 | None |
| Speed | M=16, ef=64 | INT8, always_ram |
| Balanced | M=16, ef=128 | INT8 |
| Memory | M=8, ef=64 | PQ |

### Memory Estimation

```python
# Approximate memory per vector
vector_bytes = num_vectors * dimensions * bytes_per_dim
index_bytes = num_vectors * M * 2 * 4  # HNSW edges
total = vector_bytes + index_bytes
```

## Quick Reference

### Common Operations

```python
# Pinecone upsert
index.upsert(vectors=[{"id": "1", "values": embedding, "metadata": {...}}])

# Qdrant search
client.search(collection_name="docs", query_vector=embedding, limit=10)

# pgvector query
SELECT * FROM docs ORDER BY embedding <=> $1::vector LIMIT 10;
```

## References

Detailed implementations and tuning guides:

| Reference | Description |
|-----------|-------------|
| [pinecone-implementation.md](references/pinecone-implementation.md) | Pinecone vector store with reranking |
| [qdrant-implementation.md](references/qdrant-implementation.md) | Qdrant with filtering and sparse vectors |
| [pgvector-implementation.md](references/pgvector-implementation.md) | PostgreSQL pgvector with hybrid search |
| [weaviate-implementation.md](references/weaviate-implementation.md) | Weaviate with hybrid search |
| [hnsw-parameter-tuning.md](references/hnsw-parameter-tuning.md) | Benchmark and recommend HNSW params |
| [quantization-strategies.md](references/quantization-strategies.md) | INT8, PQ, binary quantization |
| [qdrant-configuration.md](references/qdrant-configuration.md) | Qdrant-specific optimization |
| [performance-monitoring.md](references/performance-monitoring.md) | Latency and recall benchmarking |

## Best Practices

### Do's

- **Use appropriate index** — HNSW for most cases
- **Tune parameters** — ef_search, nprobe for recall/speed trade-off
- **Implement hybrid search** — Combine with keyword search for best recall
- **Monitor recall continuously** — Can degrade with data drift
- **Use quantization** — Significant memory savings with minimal quality loss
- **Benchmark with real queries** — Synthetic may not represent production
- **Start with defaults** — Tune only when needed
- **Consider tiered storage** — Hot/cold data separation at scale

### Don'ts

- **Don't skip evaluation** — Measure before optimizing
- **Don't over-index** — Start with flat, scale up
- **Don't ignore latency** — P99 matters for UX
- **Don't forget costs** — Vector storage adds up
- **Don't over-optimize early** — Profile first
- **Don't ignore build time** — Index updates have cost
- **Don't forget reindexing** — Plan for maintenance
- **Don't skip warming** — Cold indexes are slow

## Resources

- [HNSW Paper](https://arxiv.org/abs/1603.09320)
- [Pinecone Docs](https://docs.pinecone.io/)
- [Qdrant Docs](https://qdrant.tech/documentation/)
- [pgvector](https://github.com/pgvector/pgvector)
- [Weaviate Docs](https://weaviate.io/developers/weaviate)
- [Faiss Wiki](https://github.com/facebookresearch/faiss/wiki)
- [ANN Benchmarks](https://ann-benchmarks.com/)
