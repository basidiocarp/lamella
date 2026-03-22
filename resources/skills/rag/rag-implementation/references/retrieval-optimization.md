# Retrieval Optimization

---

## Optimization Techniques Overview

| Technique | Impact | Complexity | When to Use |
|-----------|--------|------------|-------------|
| **Hybrid Search** | High | Medium | Always for production |
| **Reranking** | High | Low | Top-k refinement |
| **Query Expansion** | Medium | Medium | Ambiguous queries |
| **HyDE** | Medium-High | Medium | Concept-heavy retrieval |
| **Metadata Filtering** | High | Low | Multi-tenant, categorical |
| **Query Decomposition** | Medium | High | Complex questions |
| **Contextual Compression** | Medium | Medium | Long retrieved chunks |

---

## Hybrid Search (Vector + Keyword)

### Reciprocal Rank Fusion (RRF)

```python
from dataclasses import dataclass
from typing import Callable

@dataclass
class SearchResult:
// ... (48 lines trimmed)
    keyword_results=bm25_search(query_text, top_k=20),
    vector_weight=0.6  # Favor semantic similarity
)
```

### BM25 + Vector with Weaviate

```python
from weaviate.classes.query import HybridFusion

collection = client.collections.get("Documents")

# Hybrid search with configurable fusion
// ... (10 lines trimmed)
    print(f"Score: {obj.metadata.score}")
    print(f"Explanation: {obj.metadata.explain_score}")
    print(f"Text: {obj.properties['content'][:200]}")
```

### Pinecone Sparse-Dense

```python
from pinecone_text.sparse import BM25Encoder

# Train BM25 encoder on your corpus
bm25 = BM25Encoder()
bm25.fit(corpus_documents)
// ... (9 lines trimmed)
    top_k=10,
    include_metadata=True
)
```

---

## Reranking

### Cohere Rerank

```python
import cohere

co = cohere.Client(api_key="your-api-key")

def rerank_results(
// ... (32 lines trimmed)

# Use top 5 reranked docs for LLM context
context = "\n\n".join([r["text"] for r in reranked])
```

### Cross-Encoder Reranking (Open Source)

```python
from sentence_transformers import CrossEncoder

class Reranker:
    """Rerank using cross-encoder model."""

// ... (26 lines trimmed)
    documents=retrieved_documents,
    top_k=5
)
```

### ColBERT-Style Late Interaction

```python
from colbert import Searcher
from colbert.infra import Run, RunConfig

# Setup ColBERT index (one-time)
with Run().context(RunConfig(nranks=1)):
// ... (8 lines trimmed)
# Results include token-level matching scores
for passage_id, rank, score in zip(*results):
    print(f"Rank {rank}: Doc {passage_id}, Score: {score}")
```

---

## Query Expansion

### LLM-Based Query Expansion

```python
from openai import OpenAI

client = OpenAI()

def expand_query(query: str, num_expansions: int = 3) -> list[str]:
// ... (37 lines trimmed)

# Deduplicate and rank by frequency
deduped = deduplicate_by_id(all_results)
```

### Query Rewriting

```python
def rewrite_query_for_retrieval(
    conversational_query: str,
    chat_history: list[dict]
) -> str:
    """Rewrite conversational query to standalone search query."""
// ... (30 lines trimmed)

rewritten = rewrite_query_for_retrieval(query, history)
# Output: "Best Python web framework for building REST APIs: Django vs Flask vs FastAPI"
```

---

## HyDE (Hypothetical Document Embeddings)

```python
def hyde_search(
    query: str,
    vector_store,
    embedding_model,
    top_k: int = 10
// ... (39 lines trimmed)
    vector_store=qdrant_client,
    embedding_model=sentence_transformer
)
```

### Multi-HyDE (Multiple Perspectives)

```python
def multi_hyde_search(
    query: str,
    vector_store,
    embedding_model,
    num_hypotheticals: int = 3,
// ... (33 lines trimmed)

    # Deduplicate and combine scores
    return deduplicate_and_merge(all_results)
```

---

## Metadata Filtering

### Multi-Tenant Filtering

```python
class MultiTenantRetriever:
    """Retriever with mandatory tenant isolation."""

    def __init__(self, vector_store):
        self.vector_store = vector_store
// ... (28 lines trimmed)
        "published": {"$eq": True}
    }
)
```

### Temporal Filtering

```python
from datetime import datetime, timedelta

def search_recent_documents(
    query_embedding: list[float],
    vector_store,
// ... (38 lines trimmed)

    results.sort(key=lambda x: x.boosted_score, reverse=True)
    return results[:top_k]
```

---

## Query Decomposition

```python
def decompose_complex_query(query: str) -> list[str]:
    """Break complex query into sub-questions."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
// ... (52 lines trimmed)
# Usage
complex_q = "Compare the security features of OAuth2 and API keys, and explain when to use each"
results = search_with_decomposition(complex_q, vector_store, embedding_model)
```

---

## Contextual Compression

```python
def compress_retrieved_context(
    query: str,
    documents: list[str],
    max_tokens: int = 2000
) -> str:
// ... (23 lines trimmed)
    )

    return response.choices[0].message.content
```

### Extractive Compression with Cross-Encoder

```python
from sentence_transformers import CrossEncoder

def extractive_compress(
    query: str,
    document: str,
// ... (17 lines trimmed)
    top_sentences = sorted(top_sentences, key=lambda x: x[0])  # Restore order

    return " ".join([s[1] for s in top_sentences])
```

---

## Complete Optimized Pipeline

```python
class OptimizedRetriever:
    """Production retrieval pipeline with all optimizations."""

    def __init__(
        self,
// ... (85 lines trimmed)
        """Expand query with variations."""
        # Implementation from Query Expansion section
        pass
```

---

## Performance Benchmarks

| Technique | Latency Impact | Quality Impact | Cost Impact |
|-----------|----------------|----------------|-------------|
| Vector only | Baseline | Baseline | Baseline |
| + BM25 hybrid | +10-20ms | +5-15% precision | Minimal |
| + Reranking | +50-100ms | +10-20% precision | +$0.001/query |
| + Query expansion | +100-200ms | +5-10% recall | +$0.002/query |
| + HyDE | +200-500ms | +10-25% precision | +$0.003/query |

---

## Quick Reference

| Goal | Technique | Implementation |
|------|-----------|----------------|
| Improve precision | Reranking | Cross-encoder or Cohere |
| Improve recall | Query expansion | LLM-generated variations |
| Handle synonyms | Hybrid search | BM25 + vector with RRF |
| Concept search | HyDE | Hypothetical doc embedding |
| Multi-tenant | Metadata filter | Mandatory tenant_id |
| Fresh content | Temporal filter | Date range queries |
| Complex questions | Decomposition | Sub-question retrieval |

## Related Skills

- **RAG Architect** - System design and architecture
- **NLP Engineer** - Query understanding
- **Python Pro** - Async implementation
- **ML Pipeline** - Model serving for rerankers
