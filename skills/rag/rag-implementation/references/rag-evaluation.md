# RAG Evaluation

---

## Evaluation Framework Overview

| Framework | Focus | Strengths | Use Case |
|-----------|-------|-----------|----------|
| **RAGAS** | RAG-specific metrics | Faithfulness, relevance | Production RAG evaluation |
| **TruLens** | LLM app observability | Tracing, feedback functions | Debugging and monitoring |
| **LangSmith** | LangChain ecosystem | Traces, datasets, testing | LangChain projects |
| **Custom** | Specific requirements | Full control | Domain-specific needs |

---

## Core Metrics

### Retrieval Metrics

| Metric | Formula | What It Measures |
|--------|---------|------------------|
| **Precision@k** | Relevant in top-k / k | Are retrieved docs relevant? |
| **Recall@k** | Relevant in top-k / Total relevant | Did we get all relevant docs? |
| **MRR** | 1 / Rank of first relevant | How quickly do we find relevant? |
| **NDCG@k** | DCG@k / IDCG@k | Is ranking order correct? |
| **Hit Rate** | Queries with relevant in top-k / Total queries | Binary success rate |

### Generation Metrics

| Metric | What It Measures |
|--------|------------------|
| **Faithfulness** | Is answer grounded in retrieved context? |
| **Answer Relevance** | Does answer address the question? |
| **Context Relevance** | Is retrieved context relevant to question? |
| **Context Utilization** | How much context was actually used? |

---

## Implementing Core Metrics

### Precision, Recall, and Hit Rate

```python
from dataclasses import dataclass
from typing import Set

@dataclass
class RetrievalMetrics:
// ... (43 lines trimmed)
print(f"Precision@5: {metrics.precision_at_k:.2f}")  # 2/5 = 0.40
print(f"Recall@5: {metrics.recall_at_k:.2f}")        # 2/3 = 0.67
print(f"MRR: {metrics.mrr:.2f}")                     # 1/2 = 0.50
```

### NDCG (Normalized Discounted Cumulative Gain)

```python
import numpy as np

def dcg_at_k(relevance_scores: list[float], k: int) -> float:
    """Calculate Discounted Cumulative Gain."""
    relevance_scores = np.array(relevance_scores[:k])
// ... (40 lines trimmed)

ndcg = ndcg_at_k(retrieved, relevance, k=5)
print(f"NDCG@5: {ndcg:.3f}")
```

---

## RAGAS Framework

### Installation and Setup

```python
# pip install ragas

from ragas import evaluate
from ragas.metrics import (
    faithfulness,
// ... (40 lines trimmed)

print(results)
# {'faithfulness': 0.95, 'answer_relevancy': 0.88, ...}
```

### Custom RAGAS Evaluation

```python
from ragas.metrics import Metric
from ragas.llms import LangchainLLM
from langchain_openai import ChatOpenAI

# Use custom LLM
// ... (11 lines trimmed)
for i, row in enumerate(results.to_pandas().itertuples()):
    print(f"Q{i+1}: Faithfulness={row.faithfulness:.2f}, "
          f"Relevancy={row.answer_relevancy:.2f}")
```

### RAGAS Metrics Explained

```python
"""
RAGAS Core Metrics:

1. Faithfulness (0-1):
   - Measures if answer is grounded in context
// ... (38 lines trimmed)
            })

    return issues
```

---

## TruLens Evaluation

### Setup and Basic Usage

```python
# pip install trulens-eval

from trulens_eval import Tru, TruChain, Feedback
from trulens_eval.feedback import Groundedness
from trulens_eval.feedback.provider import OpenAI as fOpenAI
// ... (46 lines trimmed)
tru.run_dashboard()  # Opens web UI
# Or get programmatically
records = tru.get_records_and_feedback(app_ids=["rag-v1"])
```

### Custom Feedback Functions

```python
from trulens_eval import Feedback, Select

def custom_citation_check(response: str, context: str) -> float:
    """Check if response cites sources from context."""
    # Extract citations from response (e.g., [1], [Source: X])
// ... (11 lines trimmed)
    custom_citation_check,
    name="Citation Accuracy"
).on_output().on(Select.RecordCalls.retriever.get_relevant_documents.rets.page_content)
```

---

## Building Custom Evaluation Pipelines

### LLM-as-Judge Evaluation

```python
from openai import OpenAI
from dataclasses import dataclass
from typing import Literal

client = OpenAI()
// ... (77 lines trimmed)
)
print(f"Faithfulness: {eval_result.score:.2f}")
print(f"Reasoning: {eval_result.reasoning}")
```

### Batch Evaluation Pipeline

```python
import asyncio
from tqdm.asyncio import tqdm_asyncio

async def evaluate_batch(
    test_cases: list[dict],
// ... (61 lines trimmed)
            }

    return results
```

---

## Debugging Poor Retrieval

### Retrieval Diagnostics

```python
def diagnose_retrieval(
    query: str,
    retrieved_docs: list,
    expected_docs: list,
    embedding_model
// ... (66 lines trimmed)
for issue in diagnosis["issues"]:
    print(f"Issue: {issue['type']}")
    print(f"Details: {issue}")
```

### Query Analysis

```python
def analyze_query_performance(
    query_logs: list[dict],
    threshold_precision: float = 0.6
) -> dict:
    """Analyze query patterns to find systematic issues."""
// ... (37 lines trimmed)
        analysis["patterns"]["failing_question_types"] = dict(question_types)

    return analysis
```

---

## Continuous Monitoring

### Production Metrics Dashboard

```python
import time
from dataclasses import dataclass, field
from collections import deque
from threading import Lock

// ... (61 lines trimmed)

# Periodically check
print(metrics.get_summary())
```

### Alerting on Quality Degradation

```python
class RAGQualityMonitor:
    """Monitor RAG quality and alert on degradation."""

    def __init__(
        self,
// ... (34 lines trimmed)
    alert = monitor.record_score(query_result["precision@5"])
    if alert:
        send_alert(alert)  # Slack, PagerDuty, etc.
```

---

## Evaluation Best Practices

| Practice | Description |
|----------|-------------|
| **Golden test set** | Maintain 50-200 curated Q&A pairs with ground truth |
| **Stratified sampling** | Include diverse query types in test set |
| **Human baselines** | Compare LLM judges against human annotators |
| **Version control** | Track evaluation results alongside model versions |
| **Regular re-evaluation** | Re-run golden tests on every retrieval change |
| **A/B testing** | Compare new retrieval strategies on live traffic |

---

## Quick Reference

| Goal | Metric | Target |
|------|--------|--------|
| Are docs relevant? | Precision@5 | > 0.7 |
| Did we get all docs? | Recall@5 | > 0.8 |
| Is ranking good? | NDCG@5 | > 0.7 |
| Is answer grounded? | Faithfulness | > 0.9 |
| Does answer fit question? | Answer Relevance | > 0.8 |
| Is context useful? | Context Relevance | > 0.7 |

| Framework | Best For |
|-----------|----------|
| RAGAS | Quick RAG-specific evaluation |
| TruLens | Production monitoring and tracing |
| Custom LLM-judge | Domain-specific criteria |
| Manual annotation | Ground truth creation |

## Related Skills

- **RAG Architect** - System design
- **ML Pipeline** - Evaluation automation
- **Data Scientist** - Statistical analysis
- **Monitoring Expert** - Production observability
