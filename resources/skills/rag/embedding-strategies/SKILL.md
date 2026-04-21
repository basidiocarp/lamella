---
name: embedding-strategies
description: "Selects and optimizes embedding models for RAG systems."
origin: lamella
---

# Embedding Strategies


## Contents

- [When to Use This Skill](#when-to-use-this-skill)
- [Model Selection Guide](#model-selection-guide)
- [Embedding Pipeline](#embedding-pipeline)
- [Quick Start](#quick-start)
- [Best Practices](#best-practices)
- [Reference Files](#reference-files)
- [Resources](#resources)

## Installation

```bash
python -m pip install langchain-voyageai
```

## When to Use This Skill

- Choosing embedding models for RAG
- Optimizing chunking strategies
- Fine-tuning embeddings for domains
- Comparing embedding model performance
- Reducing embedding dimensions
- Handling multilingual content

## Model Selection Guide

Choose the embedding family before choosing a specific model revision:

| Family | Best For | Trade-Off |
|--------|----------|-----------|
| Hosted general-purpose | Production search and document retrieval | Ongoing API cost |
| Hosted code-focused | Code search and technical documentation | Narrower domain fit |
| Multilingual | Cross-language retrieval | Higher evaluation burden |
| Open-source and self-hosted | Air-gapped or cost-sensitive deployments | Infra and tuning overhead |
| Lightweight local | Fast prototyping and low-resource systems | Lower recall ceiling |

Use [references/templates.md](references/templates.md) and the bundled RAG references when you need concrete provider examples. Avoid hard-coding a preferred model family unless the project constraints already point to one.

## Embedding Pipeline

```
Document → Chunking → Preprocessing → Embedding Model → Vector
                ↓
        [Overlap, Size]  [Clean, Normalize]  [API/Local]
```

## Quick Start

```python
from langchain_voyageai import VoyageAIEmbeddings
import os

# Example hosted embedding client
embeddings = VoyageAIEmbeddings(
    model="voyage-3-large",
    api_key=os.environ["VOYAGE_API_KEY"],
    truncation=True,
)

# Provider-specific model choices
code_embeddings = VoyageAIEmbeddings(model="voyage-code-3")
finance_embeddings = VoyageAIEmbeddings(model="voyage-finance-2")
```

## Best Practices

### Do's

- **Match model to use case**: Code vs prose vs multilingual
- **Chunk thoughtfully**: Preserve semantic boundaries
- **Normalize embeddings**: For cosine similarity search
- **Batch requests**: More efficient than one-by-one
- **Cache embeddings**: Avoid recomputing for static content
- **Evaluate with your own corpus**: Retrieval quality depends on your documents and queries

### Don'ts

- **Don't ignore token limits**: Truncation loses information
- **Don't mix embedding models**: Incompatible vector spaces
- **Don't skip preprocessing**: Garbage in, garbage out
- **Don't over-chunk**: Lose important context
- **Don't forget metadata**: Essential for filtering and debugging

## Reference Files

| File | Content |
|------|---------|
| [references/templates.md](references/templates.md) | Complete code templates: Voyage AI, OpenAI, Sentence Transformers, chunking strategies, domain pipelines, evaluation |

## Resources

- [Voyage AI Documentation](https://docs.voyageai.com/)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [Sentence Transformers](https://www.sbert.net/)
- [MTEB Benchmark](https://huggingface.co/spaces/mteb/leaderboard)
- [LangChain Embedding Models](https://python.langchain.com/docs/integrations/text_embedding/)
