# Chunking Strategies

Use this page as the routing layer for RAG chunking decisions.

## Load Order

| Need | Reference |
| --- | --- |
| choosing a chunking strategy | `chunking-strategy-selection.md` |
| structure-aware and semantic chunking | `semantic-and-structure-aware-chunking.md` |
| contextual, late, and metadata-enriched chunking | `advanced-chunking-patterns.md` |

## Core Rules

- choose chunking based on document shape and retrieval goal
- optimize for retrievability first, not just even chunk length
- keep metadata rich enough to reconstruct source context later
