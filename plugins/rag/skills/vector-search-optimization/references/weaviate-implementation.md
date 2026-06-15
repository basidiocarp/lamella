# Weaviate Implementation

Use Weaviate when you want a vector store with stronger built-in search features
than a minimal embedding bucket.

## Good Fits

- hybrid semantic and keyword search
- richer schema or filtering needs
- teams comfortable with Weaviate's API and operational model

## Rules

- keep schema design and class layout explicit
- choose hybrid, vector-only, or filter-heavy queries deliberately
- benchmark Weaviate against simpler stores before assuming you need it
