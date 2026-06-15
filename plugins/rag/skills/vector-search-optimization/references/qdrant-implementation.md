# Qdrant Implementation

Use Qdrant when you want a vector store with strong filtering, HNSW tuning, and built-in quantization support.

## Core Workflow

1. Define the collection with vector size, distance metric, and HNSW settings.
2. Upsert vectors with payloads needed for filtering and routing.
3. Query with both vector similarity and payload filters.
4. Tune search params only after measuring latency and recall.

## Good Defaults

- Keep payload fields small and filterable.
- Start with straightforward HNSW settings before adding quantization.
- Separate ingestion concerns from query-time reranking.
