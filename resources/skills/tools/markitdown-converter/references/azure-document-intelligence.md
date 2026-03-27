# Azure Document Intelligence

Use this reference for Azure-backed PDF extraction.

## Python Setup

```python
from markitdown import MarkItDown

md = MarkItDown(
    docintel_endpoint="https://YOUR-RESOURCE.cognitiveservices.azure.com/"
)

result = md.convert("complex_document.pdf")
```

## CLI Shape

```bash
markitdown document.pdf -o output.md -d -e "<endpoint>"
```

## Authentication

Set the key through environment variables or your runtime’s secret handling:

```bash
export AZURE_DOCUMENT_INTELLIGENCE_KEY="your-key"
```

## When To Use

- complex or layout-heavy PDFs
- documents where the default parser loses table or structure fidelity
