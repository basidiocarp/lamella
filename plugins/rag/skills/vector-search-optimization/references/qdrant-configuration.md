# Qdrant Index Configuration

Use this reference when tuning Qdrant collections rather than writing application code.

## Main Knobs

- Vector size and distance metric
- HNSW parameters
- Payload indexing
- Quantization mode
- Search-time `ef` overrides

## Rule of Thumb

- Tune collection design first.
- Tune HNSW next.
- Add quantization only when memory cost remains the real constraint.
