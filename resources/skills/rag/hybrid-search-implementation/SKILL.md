---
name: hybrid-search-implementation
description: "Combines vector and keyword retrieval strategies."
origin: lamella
---

# Hybrid Search Implementation

## Contents

- [When to Use This Skill](#when-to-use-this-skill)
- [Core Concepts](#core-concepts)
- [Quick Reference](#quick-reference)
- [References](#references)
- [Best Practices](#best-practices)
- [Resources](#resources)

Patterns for combining vector similarity and keyword-based search.

## When to Use This Skill

- Building RAG systems with improved recall
- Combining semantic understanding with exact matching
- Handling queries with specific terms (names, codes)
- Improving search for domain-specific vocabulary
- When pure vector search misses keyword matches

## Core Concepts

### Hybrid Search Architecture

```
Query → ┬─► Vector Search ──► Candidates ─┐
        │                                  │
        └─► Keyword Search ─► Candidates ─┴─► Fusion ─► Results
```

### Fusion Methods

| Method            | Description              | Best For        |
| ----------------- | ------------------------ | --------------- |
| **RRF**           | Reciprocal Rank Fusion   | General purpose |
| **Linear**        | Weighted sum of scores   | Tunable balance |
| **Cross-encoder** | Rerank with neural model | Highest quality |
| **Cascade**       | Filter then rerank       | Efficiency      |

## Quick Reference

### RRF Formula

```python
# score(doc) = Σ 1 / (k + rank(doc))
# k typically = 60
scores[doc_id] += weight * (1.0 / (k + rank + 1))
```

### Linear Combination

```python
combined_score = alpha * vector_score + (1 - alpha) * keyword_score
```

### Typical Weights

| Use Case | Vector Weight | Keyword Weight |
|----------|---------------|----------------|
| Semantic-heavy | 0.7 | 0.3 |
| Balanced | 0.5 | 0.5 |
| Exact-match-heavy | 0.3 | 0.7 |

## References

Detailed implementations:

| Reference | Description |
|-----------|-------------|
| [reciprocal-rank-fusion.md](references/reciprocal-rank-fusion.md) | RRF and linear combination algorithms |
| [postgresql-hybrid-search.md](references/postgresql-hybrid-search.md) | pgvector + full-text search |
| [elasticsearch-hybrid-search.md](references/elasticsearch-hybrid-search.md) | ES dense vectors + BM25 |
| [hybrid-rag-pipeline.md](references/hybrid-rag-pipeline.md) | Complete RAG pipeline with reranking |

## Best Practices

### Do's

- **Tune weights empirically** - Test on your data
- **Use RRF for simplicity** - Works well without tuning
- **Add reranking** - Significant quality improvement
- **Log both scores** - Helps with debugging
- **A/B test** - Measure real user impact

### Don'ts

- **Don't assume one size fits all** - Different queries need different weights
- **Don't skip keyword search** - Handles exact matches better
- **Don't over-fetch** - Balance recall vs latency
- **Don't ignore edge cases** - Empty results, single word queries

## Resources

- [RRF Paper](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf)
- [Vespa Hybrid Search](https://blog.vespa.ai/improving-text-ranking-with-few-shot-prompting/)
- [Cohere Rerank](https://docs.cohere.com/docs/reranking)
