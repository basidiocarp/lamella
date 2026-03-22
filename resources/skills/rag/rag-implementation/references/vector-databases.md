# Vector Databases

---

## Database Comparison Matrix

| Feature | Pinecone | Weaviate | Qdrant | Chroma | pgvector |
|---------|----------|----------|--------|--------|----------|
| **Hosting** | Managed only | Managed + Self-hosted | Managed + Self-hosted | Self-hosted (cloud beta) | Self-hosted |
| **Hybrid Search** | Yes (sparse-dense) | Yes (BM25 + vector) | Yes (sparse vectors) | Limited | Manual (+ pg_trgm) |
| **Filtering** | Excellent | Excellent | Excellent | Basic | SQL-native |
| **Max Dimensions** | 20,000 | Unlimited | 65,535 | Unlimited | 2,000 |
| **Pricing Model** | Per-vector/query | Per-node | Per-node | Free (OSS) | Free (extension) |
| **Multi-tenancy** | Namespaces | Multi-tenant class | Collections + payloads | Collections | Schema/RLS |
| **Best For** | Enterprise SaaS | Semantic apps | High-performance | Prototyping | Postgres shops |

## When to Use Each

### Pinecone
```
Best For:
- Enterprise RAG with strict SLAs
- Teams wanting zero infrastructure management
- Applications needing sparse-dense hybrid search
// ... (5 lines trimmed)
- Complex filtering requirements beyond metadata
- Wanting to avoid vendor lock-in
```

### Weaviate
```
Best For:
- Semantic search with built-in vectorization
- Multi-modal (text, image) applications
- GraphQL-native teams
- Hybrid BM25 + vector search requirements

When to Avoid:
- Simple embedding storage only
- Memory-constrained environments
- Teams unfamiliar with GraphQL
```

### Qdrant
```
Best For:
- High-performance, low-latency requirements
- Complex filtering with payload indexes
- Rust/performance-focused teams
- Self-hosted with full control

When to Avoid:
- Teams wanting fully managed simplicity
- GraphQL preference (REST/gRPC only)
```

### Chroma
```
Best For:
- Local development and prototyping
- LangChain/LlamaIndex integration
- Simple RAG proof-of-concepts
- Educational projects

When to Avoid:
- Production workloads at scale
- Multi-tenant applications
- High availability requirements
```

### pgvector
```
Best For:
- Existing PostgreSQL infrastructure
- Transactional + vector in same DB
- SQL-native teams
- Cost optimization (no new infra)

When to Avoid:
- Vectors > 2000 dimensions
- Billions of vectors (scaling limits)
- Sub-millisecond latency requirements
```

---

## Pinecone Setup

```python
from pinecone import Pinecone, ServerlessSpec

# Initialize client
pc = Pinecone(api_key="your-api-key")

// ... (52 lines trimmed)
    top_k=10,
    alpha=0.5  # Balance dense vs sparse
)
```

---

## Weaviate Setup

```python
import weaviate
from weaviate.classes.config import Configure, Property, DataType

# Connect to Weaviate Cloud
client = weaviate.connect_to_weaviate_cloud(
// ... (53 lines trimmed)
    print(f"Score: {obj.metadata.score}, Content: {obj.properties['content'][:100]}")

client.close()
```

---

## Qdrant Setup

```python
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct,
    Filter, FieldCondition, MatchValue,
    PayloadSchemaType
// ... (68 lines trimmed)
        payloads=payloads_list
    )
)
```

---

## Chroma Setup

```python
import chromadb
from chromadb.config import Settings

# Persistent local storage
client = chromadb.PersistentClient(
// ... (47 lines trimmed)
    documents=["Updated installation guide..."],
    metadatas=[{"source": "manual_v2.pdf", "page": 42}]
)
```

---

## pgvector Setup

```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table with vector column
CREATE TABLE documents (
// ... (18 lines trimmed)

-- Create index on filter columns
CREATE INDEX ON documents (tenant_id);
```

```python
import psycopg2
from pgvector.psycopg2 import register_vector

conn = psycopg2.connect("postgresql://localhost/ragdb")
register_vector(conn)
// ... (38 lines trimmed)
    """,
    (query_embedding, query_text, "acme-corp", query_text)
)
```

---

## Index Tuning Guide

### HNSW Parameters

| Parameter | Description | Trade-off |
|-----------|-------------|-----------|
| `m` | Connections per node | Higher = better recall, more memory |
| `ef_construction` | Build-time search width | Higher = better index, slower build |
| `ef_search` | Query-time search width | Higher = better recall, slower query |

```python
# Qdrant HNSW tuning
client.update_collection(
    collection_name="documents",
    hnsw_config=HnswConfigDiff(
        m=16,                    # Default: 16, increase for better recall
// ... (9 lines trimmed)
    limit=10,
    search_params=SearchParams(hnsw_ef=128)  # Higher for better recall
)
```

### Quantization for Scale

```python
# Qdrant scalar quantization (4x memory reduction)
from qdrant_client.models import ScalarQuantization, ScalarQuantizationConfig

client.update_collection(
// ... (7 lines trimmed)
    )
)
```

---

## Multi-Tenancy Patterns

### Namespace Isolation (Pinecone)
```python
# Tenant data in separate namespaces
index.upsert(vectors=[...], namespace="tenant-acme")
index.upsert(vectors=[...], namespace="tenant-globex")

# Query within tenant namespace
results = index.query(
    vector=query_embedding,
    namespace="tenant-acme",
    top_k=10
)
```

### Metadata Filtering (Qdrant/Weaviate)
```python
# Add tenant_id to all documents
point = PointStruct(
    id="doc-1",
    vector=embedding,
// ... (9 lines trimmed)
    )
)
```

### Collection per Tenant (High Isolation)
```python
# Create tenant-specific collection
client.create_collection(
    collection_name=f"docs_{tenant_id}",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
)
```

---

## Decision Flowchart

```
Start
  │
  ├─ Need managed service with zero ops?
  │   └─ Yes → Pinecone
  │
// ... (10 lines trimmed)
  │   └─ Yes → Chroma
  │
  └─ Default recommendation → Qdrant (balance of features/performance)
```

---

## Quick Reference

| Task | Pinecone | Weaviate | Qdrant | pgvector |
|------|----------|----------|--------|----------|
| Create index/collection | `create_index()` | `collections.create()` | `create_collection()` | `CREATE TABLE` |
| Insert | `upsert()` | `data.insert()` | `upsert()` | `INSERT` |
| Search | `query()` | `query.near_vector()` | `search()` | `ORDER BY <=>` |
| Filter | `filter={}` | `Filter.by_property()` | `query_filter=Filter()` | `WHERE` |
| Delete | `delete()` | `data.delete_by_id()` | `delete()` | `DELETE` |
| Hybrid | sparse_vector param | `query.hybrid()` | sparse vectors | Manual |

## Related Skills

- **Database Optimizer** - Index tuning and query performance
- **Cloud Architect** - Infrastructure decisions for vector DB hosting
- **Python Pro** - Implementation patterns with async clients
