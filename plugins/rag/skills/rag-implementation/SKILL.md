---
name: rag-implementation
description: "Builds Retrieval-Augmented Generation systems for LLM applications."
origin: lamella
---

# RAG Implementation


## Contents

- [When to Use This Skill](#when-to-use-this-skill)
- [Core Components](#core-components)
- [Quick Start](#quick-start)
- [Best Practices](#best-practices)
- [Common Issues](#common-issues)
- [Reference Files](#reference-files)
- [Resources](#resources)

## Installation

```bash
python -m pip install langgraph langchain-anthropic langchain-voyageai langchain-pinecone
```

## When to Use This Skill

- Building Q&A systems over proprietary documents
- Creating chatbots with current, factual information
- Implementing semantic search with natural language
- Reducing hallucinations with grounded responses
- Building documentation assistants

## Core Components

### Vector Databases

| Database | Best For |
|----------|----------|
| **Pinecone** | Managed, scalable, serverless |
| **Weaviate** | Hybrid search, GraphQL |
| **Chroma** | Local development, lightweight |
| **pgvector** | PostgreSQL integration |
| **Qdrant** | Fast filtered search |

### Embedding Model Families

| Family | Best For |
|--------|----------|
| Hosted general-purpose embeddings | Managed production retrieval |
| Hosted code-focused embeddings | Code search and technical docs |
| Open-source self-hosted embeddings | Air-gapped or infra-owned deployments |
| Lightweight local embeddings | Fast prototyping and small datasets |

Use [references/embedding-models.md](references/embedding-models.md) for the current provider and dimension trade-offs rather than copying model rankings into the main skill body.

### Retrieval Strategies

- **Dense**: Semantic similarity via embeddings
- **Sparse**: Keyword matching (BM25)
- **Hybrid**: Combine dense + sparse
- **Multi-Query**: Multiple query variations
- **HyDE**: Hypothetical document embeddings

## Quick Start

```python
from langgraph.graph import StateGraph, START, END
from langchain_anthropic import ChatAnthropic
from langchain_voyageai import VoyageAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from typing import TypedDict

class RAGState(TypedDict):
    question: str
    context: list[str]
    answer: str

builder = StateGraph(RAGState)
builder.add_node("retrieve", retrieve_docs)
builder.add_node("generate", generate_answer)
builder.add_edge(START, "retrieve")
builder.add_edge("retrieve", "generate")
builder.add_edge("generate", END)

rag_chain = builder.compile()
```

## Best Practices

1. **Chunk Size**: 500-1000 tokens; balance context vs specificity
2. **Overlap**: 10-20% to preserve boundary context
3. **Metadata**: Include source, page, timestamp for filtering
4. **Hybrid Search**: Combine semantic + keyword for best recall
5. **Reranking**: Use cross-encoder for precision-critical apps
6. **Citations**: Always return source documents
7. **Evaluation**: Continuously test retrieval and accuracy
8. **Monitoring**: Track metrics and latency in production

## Common Issues

| Issue | Solution |
|-------|----------|
| Poor retrieval | Check embedding quality, chunk size, query formulation |
| Irrelevant results | Add metadata filtering, use hybrid search, rerank |
| Missing info | Ensure docs indexed, check chunking |
| Slow queries | Optimize vector store, use caching, reduce k |
| Hallucinations | Improve grounding prompt, add verification |
| Context too long | Use compression or parent document retriever |

## Reference Files

| File | Content |
|------|---------|
| [references/advanced-patterns.md](references/advanced-patterns.md) | Hybrid, Multi-Query, Compression, Parent Doc, HyDE, CRAG |
| [references/chunking-strategies.md](references/chunking-strategies.md) | Fixed-size, recursive, semantic, document-aware, agentic chunking |
| [references/embedding-models.md](references/embedding-models.md) | Model comparison, OpenAI/Cohere/Voyage/BGE embeddings, dimension trade-offs |
| [references/retrieval-optimization.md](references/retrieval-optimization.md) | Hybrid search, reranking, query expansion, HyDE, metadata filtering |
| [references/vector-databases.md](references/vector-databases.md) | Pinecone, Weaviate, Qdrant, Chroma, pgvector setup and comparison |
| [references/rag-evaluation.md](references/rag-evaluation.md) | RAGAS, metrics (precision, recall, MRR, NDCG), evaluation frameworks |

## Resources

- [LangChain RAG Tutorial](https://python.langchain.com/docs/tutorials/rag/)
- [LangGraph RAG Examples](https://langchain-ai.github.io/langgraph/tutorials/rag/)
- [Pinecone Best Practices](https://docs.pinecone.io/)
- [Voyage AI Docs](https://docs.voyageai.com/)
