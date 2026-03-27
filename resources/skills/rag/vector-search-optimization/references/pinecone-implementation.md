# Pinecone Implementation

Use Pinecone when you want a managed vector store with namespace isolation and hosted operations.

## Core Workflow

1. Create the index with the right dimension and metric.
2. Partition tenants or environments with namespaces.
3. Upsert vectors plus compact metadata.
4. Query candidates, then rerank outside the store if needed.

## Guardrails

- Keep metadata lean.
- Avoid overloading namespaces with too many responsibilities.
- Treat reranking and business scoring as separate layers.
