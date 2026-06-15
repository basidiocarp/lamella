# Performance and Best Practices

Use this reference for scaling and safe usage patterns.

## Batch and Stream

```python
md = MarkItDown()

with open("large_file.pdf", "rb") as stream:
    result = md.convert_stream(stream, file_extension=".pdf")
```

Reuse the same `MarkItDown` instance for batches when possible.

## Best Practices

- use default conversion first for simple documents
- enable provider integrations only when they add clear value
- keep large-file handling stream-based
- trim excess whitespace only after conversion, not before

## Cost and Performance Notes

- OCR and audio transcription are compute-heavy
- AI image descriptions add latency and cost
- large PDFs should be streamed, not repeatedly reopened
