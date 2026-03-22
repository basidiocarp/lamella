# Embedding Models

---

## Model Comparison Matrix

| Model | Dimensions | Max Tokens | Strengths | Provider |
|-------|------------|------------|-----------|----------|
| **text-embedding-3-large** | 3072 (or 256-3072) | 8191 | Best quality, flexible dims | OpenAI |
| **text-embedding-3-small** | 1536 (or 256-1536) | 8191 | Cost-effective, good quality | OpenAI |
| **embed-english-v3.0** | 1024 | 512 | Excellent compression, fast | Cohere |
| **embed-multilingual-v3.0** | 1024 | 512 | 100+ languages | Cohere |
| **voyage-large-2** | 1536 | 16000 | Long context, code-aware | Voyage AI |
| **voyage-code-2** | 1536 | 16000 | Code retrieval specialist | Voyage AI |
| **BGE-large-en-v1.5** | 1024 | 512 | Open source, high quality | BAAI |
| **BGE-M3** | 1024 | 8192 | Multi-lingual, multi-granularity | BAAI |
| **E5-large-v2** | 1024 | 512 | Strong benchmark performance | Microsoft |
| **GTE-large** | 1024 | 512 | Good general-purpose | Alibaba |
| **all-MiniLM-L6-v2** | 384 | 256 | Fast, lightweight | Sentence Transformers |
| **nomic-embed-text-v1.5** | 768 | 8192 | Long context, open weights | Nomic AI |

---

## When to Use Each Model

### OpenAI text-embedding-3-large
```
Best For:
- Production RAG requiring highest accuracy
- Enterprise applications with quality SLAs
- Flexible dimension requirements (can reduce to save cost)
- English and major languages

When to Avoid:
- Cost-sensitive high-volume applications
- Air-gapped or offline deployments
- Specialized domains without fine-tuning budget
```

### OpenAI text-embedding-3-small
```
Best For:
- Cost-effective production deployments
- Good quality-to-cost ratio
- General-purpose retrieval tasks
- Quick prototyping with API simplicity

When to Avoid:
- Maximum accuracy requirements
- Specialized technical domains
- When open-source is required
```

### Cohere embed-v3
```
Best For:
- Multi-lingual applications (100+ languages)
- Search-optimized retrieval (search_document/search_query types)
- Compression (int8/binary quantization built-in)
- Production with cost constraints

When to Avoid:
- Very long documents (512 token limit)
- Code-heavy retrieval tasks
```

### Voyage AI
```
Best For:
- Code retrieval and technical documentation
- Long-context documents (16K tokens)
- Domain-specific fine-tuning options
- Legal/financial specialized models

When to Avoid:
- Budget-constrained projects
- Simple general-purpose retrieval
```

### BGE / E5 (Open Source)
```
Best For:
- Self-hosted deployments
- Air-gapped environments
- Cost elimination (no API fees)
- Fine-tuning on custom domains

When to Avoid:
- Teams without GPU infrastructure
- Need for zero maintenance
- Maximum out-of-box quality
```

---

## OpenAI Embeddings

```python
from openai import OpenAI

client = OpenAI(api_key="your-api-key")

def get_embedding(
// ... (36 lines trimmed)
    model="text-embedding-3-large",
    dimensions=1024  # Reduce from 3072
)
```

### Dimension Trade-offs

| Original | Reduced | Quality Loss | Storage Savings |
|----------|---------|--------------|-----------------|
| 3072 | 1536 | ~1-2% | 50% |
| 3072 | 1024 | ~2-4% | 67% |
| 3072 | 512 | ~5-8% | 83% |
| 3072 | 256 | ~10-15% | 92% |

---

## Cohere Embeddings

```python
import cohere

co = cohere.Client(api_key="your-api-key")

# Document embeddings (for indexing)
// ... (25 lines trimmed)
    input_type="search_document",
    embedding_types=["int8"]  # 4x smaller than float32
).embeddings
```

### Cohere Input Types

| Type | Use Case |
|------|----------|
| `search_document` | Documents being indexed in vector DB |
| `search_query` | User search queries |
| `classification` | Text classification tasks |
| `clustering` | Document clustering |

---

## Voyage AI Embeddings

```python
import voyageai

vo = voyageai.Client(api_key="your-api-key")

# General embeddings
// ... (20 lines trimmed)
    model="voyage-large-2",
    input_type="document"
).embeddings[0]
```

---

## Open Source Models (Sentence Transformers)

```python
from sentence_transformers import SentenceTransformer

# Load model (downloads on first use)
model = SentenceTransformer("BAAI/bge-large-en-v1.5")

// ... (25 lines trimmed)
    batch_size=64
)
model.stop_multi_process_pool(pool)
```

### BGE-M3 (Multi-lingual, Multi-granularity)

```python
from FlagEmbedding import BGEM3FlagModel

model = BGEM3FlagModel("BAAI/bge-m3", use_fp16=True)

// ... (9 lines trimmed)
sparse_embeddings = output["lexical_weights"]
colbert_embeddings = output["colbert_vecs"]
```

---

## Embedding Fine-Tuning

### When to Fine-Tune

| Scenario | Recommendation |
|----------|----------------|
| Domain-specific jargon (legal, medical) | Fine-tune on domain corpus |
| Low retrieval precision (<80%) | Fine-tune with hard negatives |
| Out-of-distribution queries | Fine-tune with query-doc pairs |
| Cost optimization | Fine-tune smaller model to match larger |

### Fine-Tuning with Sentence Transformers

```python
from sentence_transformers import SentenceTransformer, InputExample, losses
from torch.utils.data import DataLoader

# Prepare training data
train_examples = [
// ... (29 lines trimmed)
    InputExample(texts=["query", "positive_doc", "negative_doc1", "negative_doc2"])
]
train_loss = losses.MultipleNegativesRankingLoss(model)
```

### Hard Negative Mining

```python
from sentence_transformers import SentenceTransformer
from sentence_transformers.util import semantic_search
import torch

def mine_hard_negatives(
// ... (29 lines trimmed)
        ))

    return examples
```

---

## Embedding Pipeline Best Practices

### Text Preprocessing

```python
import re
from typing import Callable

def clean_for_embedding(text: str) -> str:
    """Clean text before embedding."""
// ... (20 lines trimmed)
    "how to install",
    prefix="Represent this sentence for searching relevant passages: "
)
```

### Caching Embeddings

```python
import hashlib
import json
from functools import lru_cache
from pathlib import Path

// ... (31 lines trimmed)
    embedding = get_embedding(text, model)  # Call API
    cache.set(text, model, embedding)
    return embedding
```

### Batching Strategy

```python
from typing import Iterator
import asyncio
from openai import AsyncOpenAI

def batch_texts(texts: list[str], batch_size: int = 100) -> Iterator[list[str]]:
// ... (24 lines trimmed)

    # Flatten results
    return [emb for batch_result in results for emb in batch_result]
```

---

## Model Selection Flowchart

```
Start
  │
  ├─ Need offline/self-hosted?
  │   └─ Yes → BGE-large or E5-large (open source)
  │
// ... (13 lines trimmed)
  │   └─ Yes → text-embedding-3-large
  │
  └─ Default → text-embedding-3-small (best balance)
```

---

## Quick Reference

| Task | Recommendation |
|------|----------------|
| Production RAG (English) | text-embedding-3-small/large |
| Multi-lingual | Cohere embed-multilingual-v3 |
| Code retrieval | Voyage-code-2 |
| Self-hosted | BGE-large-en-v1.5 |
| Long documents | Voyage-large-2, nomic-embed-text |
| Prototyping | all-MiniLM-L6-v2 (fast, free) |
| Maximum quality | text-embedding-3-large |
| Cost optimized | text-embedding-3-small @ 512 dims |

## Related Skills

- **RAG Architect** - Vector database integration
- **Python Pro** - Async embedding pipelines
- **ML Pipeline** - Embedding model deployment
- **Fine-Tuning Expert** - Custom embedding training
