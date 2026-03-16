# Chunking Strategies

---

## Strategy Comparison Matrix

| Strategy | Best For | Chunk Quality | Implementation Complexity |
|----------|----------|---------------|---------------------------|
| **Fixed-size** | Simple documents, logs | Low-Medium | Simple |
| **Recursive character** | General text, articles | Medium | Simple |
| **Sentence-based** | Conversational, Q&A | Medium-High | Medium |
| **Semantic** | Technical docs, manuals | High | Medium |
| **Document-aware** | Structured content (MD, HTML) | High | Medium |
| **Agentic/Contextual** | Complex documents | Very High | Complex |
| **Late chunking** | Long-context embeddings | High | Medium |

---

## When to Use Each Strategy

### Fixed-Size Chunking
```
Best For:
- Log files and structured data
- Quick prototyping
- When content has no natural structure
- Baseline comparison

When to Avoid:
- Technical documentation
- Content with semantic units (paragraphs, sections)
- When context preservation matters
```

### Recursive Character Splitting
```
Best For:
- General articles and blog posts
- Mixed content types
- Default starting point for most RAG
- LangChain/LlamaIndex default

When to Avoid:
- Highly structured documents
- Code-heavy content
- Tables and lists
```

### Semantic Chunking
```
Best For:
- Technical documentation
- Research papers
- Content with natural topic boundaries
- When retrieval precision is critical

When to Avoid:
- Real-time ingestion (slower)
- Very short documents
- Cost-sensitive pipelines (requires embeddings)
```

### Document-Aware Chunking
```
Best For:
- Markdown documentation
- HTML pages
- LaTeX papers
- Code files

When to Avoid:
- Plain text without structure
- Inconsistent formatting
```

---

## Fixed-Size Chunking

```python
def fixed_size_chunk(
    text: str,
    chunk_size: int = 500,
    overlap: int = 50
) -> list[str]:
// ... (19 lines trimmed)

# Usage
chunks = fixed_size_chunk(document_text, chunk_size=500, overlap=50)
```

---

## Recursive Character Splitting (LangChain Style)

```python
from typing import Callable

class RecursiveCharacterSplitter:
    """Split text recursively using multiple separators."""

// ... (78 lines trimmed)
    separators=["\n\n", "\n", ". ", " "]
)
chunks = splitter.split_text(document_text)
```

### Token-Based Splitting

```python
import tiktoken

def create_token_splitter(
    model: str = "gpt-4",
    chunk_size: int = 500,
// ... (14 lines trimmed)
# Usage
token_splitter = create_token_splitter(chunk_size=500, chunk_overlap=50)
chunks = token_splitter.split_text(document_text)
```

---

## Sentence-Based Chunking

```python
import re
from dataclasses import dataclass

@dataclass
class SentenceChunk:
// ... (63 lines trimmed)
        chunks.append(" ".join(current_chunk))

    return chunks
```

---

## Semantic Chunking

```python
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

class SemanticChunker:
// ... (92 lines trimmed)
    max_chunk_size=1000
)
semantic_chunks = chunker.chunk(document_text)
```

### Percentile-Based Breakpoints

```python
def find_breakpoints_percentile(
    embeddings: np.ndarray,
    percentile: int = 25
) -> list[int]:
    """Find breakpoints at similarity drops below percentile threshold."""
// ... (11 lines trimmed)
    threshold = np.percentile(sim_values, percentile)

    return [i for i, sim in similarities if sim < threshold]
```

---

## Document-Aware Chunking

### Markdown Chunking

```python
import re
from dataclasses import dataclass

@dataclass
class MarkdownChunk:
// ... (81 lines trimmed)
            ))

    return chunks
```

### Code-Aware Chunking

```python
import re
from dataclasses import dataclass

@dataclass
class CodeChunk:
// ... (85 lines trimmed)
        ))

    return chunks
```

---

## Contextual/Agentic Chunking

```python
from openai import OpenAI

def contextual_chunk(
    document: str,
    max_chunk_size: int = 1500
// ... (33 lines trimmed)
        })

    return contextualized_chunks
```

### Propositions-Based Chunking

```python
def extract_propositions(text: str) -> list[str]:
    """Extract atomic propositions from text using LLM."""
    client = OpenAI()

    response = client.chat.completions.create(
// ... (24 lines trimmed)
# Usage: For very fine-grained retrieval
propositions = extract_propositions(document_text)
# Each proposition becomes its own retrievable unit
```

---

## Late Chunking (for Long-Context Embeddings)

```python
from transformers import AutoTokenizer, AutoModel
import torch

class LateChunker:
    """
// ... (64 lines trimmed)
    chunk_size=512,
    overlap=64
)
```

---

## Metadata Enrichment

```python
from dataclasses import dataclass
from datetime import datetime
import hashlib

@dataclass
// ... (34 lines trimmed)
        metadata.update(additional_metadata)

    return EnrichedChunk(text=text, embedding=None, metadata=metadata)
```

---

## Chunk Size Selection Guide

| Document Type | Recommended Size | Overlap | Rationale |
|--------------|------------------|---------|-----------|
| FAQ/Q&A | 200-400 tokens | 20-50 | Keep Q&A pairs together |
| Technical docs | 400-600 tokens | 50-100 | Balance context vs precision |
| Legal/contracts | 600-800 tokens | 100-150 | Preserve clause context |
| Code documentation | 300-500 tokens | 50-100 | Keep function docs together |
| Chat transcripts | 150-300 tokens | 25-50 | Natural turn boundaries |
| Research papers | 500-800 tokens | 100-200 | Section-level coherence |

---

## Quick Reference

| Strategy | Use Case | Code Pattern |
|----------|----------|--------------|
| Fixed-size | Logs, baseline | `text[i:i+chunk_size]` |
| Recursive | General text | Split by `["\n\n", "\n", ". "]` |
| Sentence | Q&A content | `sent_tokenize()` + merge |
| Semantic | Technical docs | Similarity-based breaks |
| Markdown | Documentation | Header-aware splitting |
| Late chunking | Long-context models | Embed full, pool chunks |

## Related Skills

- **RAG Architect** - Integration with vector databases
- **Python Pro** - Preprocessing pipelines
- **NLP Engineer** - Tokenization and text processing
