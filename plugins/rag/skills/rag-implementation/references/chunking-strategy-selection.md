# Chunking Strategy Selection

Common choices:

- fixed-size for baselines or structureless text
- recursive splitting for general text
- sentence-based chunking for conversational or Q&A material
- document-aware chunking for markdown, HTML, or code

Pick the simplest strategy that preserves the semantic unit users actually ask
about.
