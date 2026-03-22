# PostgreSQL Hybrid Search

Hybrid search with pgvector and full-text search.

```python
import asyncpg
from typing import List, Dict, Optional
import numpy as np

class PostgresHybridSearch:
// ... (123 lines trimmed)
        # Sort by rerank score and return top results
        reranked = sorted(candidates, key=lambda x: x["rerank_score"], reverse=True)
        return reranked[:limit]
```
