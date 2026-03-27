# RAG Evaluation

Compact evaluation patterns for measuring retrieval quality and grounded generation.

## Evaluate Both Retrieval and Generation

```text
Retrieval answers:
- did we fetch the right documents?

Generation answers:
- did the model use them correctly?
```

Do not treat a good answer as proof of good retrieval. The model can guess.

## Core Retrieval Metrics

Use these first:

```text
Precision@k  -> how many retrieved docs are relevant
Recall@k     -> whether relevant docs were missed
MRR          -> how quickly the first useful doc appears
NDCG@k       -> whether ranking order is sensible
Hit Rate     -> whether at least one useful doc appeared
```

Minimal sketch:

```python
def precision_at_k(retrieved, relevant, k):
    top_k = retrieved[:k]
    return len([doc for doc in top_k if doc in relevant]) / k

def recall_at_k(retrieved, relevant, k):
    top_k = retrieved[:k]
    return len([doc for doc in top_k if doc in relevant]) / len(relevant)
```

## Core Generation Metrics

Track:

```text
Faithfulness       -> answer stays grounded in context
Answer relevance   -> answer addresses the question
Context relevance  -> retrieved context matches the question
Context utilization -> retrieved context is actually used
```

These can be scored with:
- human review
- LLM-as-judge
- framework tools like RAGAS

## RAGAS and Similar Tooling

Frameworks are useful when you want:
- repeatable offline evaluation
- side-by-side system comparisons
- a standard scoring vocabulary

Use them as a measurement layer, not as your only truth source.

## LLM-as-Judge

Useful for:
- faithfulness checks
- citation or grounding checks
- failure clustering at scale

Pattern:

```text
Question
Retrieved context
Answer
Judge prompt:
- is the answer supported?
- what claims are unsupported?
- score 1-5 with a reason
```

Keep judge prompts narrow. Broad “is this good?” prompts produce noisy signals.

## Failure Analysis

When quality is poor, classify the failure first:

```text
retrieval failure:
- relevant docs missing
- ranking weak
- metadata filter too strict or too loose

generation failure:
- hallucinated beyond context
- ignored the best evidence
- weak synthesis of retrieved docs
```

This prevents tuning the wrong layer.

## Build an Evaluation Set

A useful test set has:
- representative user questions
- known relevant documents
- expected answer traits
- a mix of easy, ambiguous, and adversarial cases

Include:
- factual lookups
- comparison questions
- follow-ups from conversation
- edge cases with partial or conflicting sources

## Production Monitoring

Monitor over time:

```text
- retrieval hit rate
- average judge score
- unsupported-claim rate
- empty or low-confidence retrievals
- query classes that degrade after changes
```

Alert on sustained degradation, not one-off misses.

## Default Evaluation Loop

```text
1. measure retrieval metrics on a labeled set
2. score groundedness on generated answers
3. inspect failures by category
4. fix retrieval before prompt-tuning the generator
5. re-run the same benchmark after each change
```
