# Retrieval Optimization

Compact guidance for improving recall and ranking quality in production RAG.

## Start with the Highest-Leverage Techniques

```text
1. hybrid search
2. reranking
3. metadata filtering
4. query rewriting
5. only then heavier techniques like HyDE or decomposition
```

## Hybrid Search

Combine lexical and semantic retrieval so exact terms and conceptual similarity both matter.

```python
def hybrid_search(query, bm25_results, vector_results, k=60):
    scores = {}
    for rank, doc in enumerate(bm25_results, start=1):
        scores.setdefault(doc.id, 0)
        scores[doc.id] += 1 / (k + rank)
    for rank, doc in enumerate(vector_results, start=1):
        scores.setdefault(doc.id, 0)
        scores[doc.id] += 1 / (k + rank)
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)
```

Use hybrid search when:
- you have identifiers, jargon, or exact terms
- pure embedding search misses keyword-heavy queries

## Reranking

Retrieve broadly, then rerank narrowly.

```python
def rerank(query: str, docs: list[str], model) -> list[str]:
    scored = [(doc, model.predict([(query, doc)])[0]) for doc in docs]
    return [doc for doc, _ in sorted(scored, key=lambda x: x[1], reverse=True)]
```

Best practice:
- retrieve `20-100`
- rerank
- send only the top few to the generator

## Metadata Filtering

```python
filters = {
    "tenant_id": {"$eq": tenant_id},
    "published": {"$eq": True},
    "doc_type": {"$in": ["guide", "runbook"]},
}
```

Use metadata filters early for:
- tenant isolation
- language, region, product, or doc type constraints
- date windows and freshness controls

This is often a bigger win than tuning embeddings.

## Query Rewriting

Rewrite user chat into a standalone retrieval query.

```python
def rewrite_query(user_query: str, history_summary: str) -> str:
    return f"{user_query}\nContext: {history_summary}".strip()
```

Use when:
- queries are conversational
- pronouns or omitted nouns hide intent
- the user asks follow-up questions

## HyDE

Generate a hypothetical ideal answer, embed that, and retrieve against it.

Use when:
- the question is concept-heavy
- normal phrasing is sparse or indirect
- the corpus is explanatory rather than keyword-rich

Avoid making it your default first step. It adds cost and complexity.

## Query Decomposition

Break one hard query into smaller sub-questions when the user asks for:
- comparisons
- multi-part explanations
- cross-topic synthesis

Example:

```text
"Compare OAuth2 and API keys, and explain when to use each"
```

Becomes:
- What are OAuth2 strengths and risks?
- What are API key strengths and risks?
- When is each appropriate?

## Context Compression

After retrieval, compress or extract only the relevant spans before generation.

```text
retrieved docs -> select relevant passages -> build final context
```

Use compression when:
- chunks are long
- retrieved material contains repetitive boilerplate
- token budget is tight

## Practical Retrieval Stack

```text
baseline:
- hybrid retrieval
- strict metadata filtering
- reranker

add when needed:
- query rewriting for chat
- HyDE for conceptual search
- decomposition for compound questions
- compression for long contexts
```
