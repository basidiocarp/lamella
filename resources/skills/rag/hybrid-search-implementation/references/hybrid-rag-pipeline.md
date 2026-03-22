# Hybrid RAG Pipeline

Complete hybrid search pipeline with reranking for RAG applications.

```python
from typing import List, Dict, Optional, Callable
from dataclasses import dataclass
import asyncio

@dataclass
// ... (138 lines trimmed)
            result.score = float(score)

        return sorted(results, key=lambda x: x.score, reverse=True)
```
