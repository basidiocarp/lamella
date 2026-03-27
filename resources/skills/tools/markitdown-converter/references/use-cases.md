# MarkItDown Use Cases

Use these examples as starting points for common document-to-Markdown workflows.

## Convert One File

```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("report.pdf")
print(result.text_content)
```

## Batch Convert a Folder

```python
from pathlib import Path
from markitdown import MarkItDown

md = MarkItDown()
for path in Path("docs").glob("*.pdf"):
    result = md.convert(path)
    path.with_suffix(".md").write_text(result.text_content)
```

## Convert Office Files

MarkItDown works well for `pptx`, `docx`, and `xlsx` when the goal is text
extraction, summary generation, or LLM ingestion rather than faithful visual
reproduction.

## Add Image Descriptions

When a workflow needs richer markdown from slides or scanned content, pair
MarkItDown with an image-description model and document the cost and latency
tradeoffs beside the workflow.

## Practical Rule

Treat MarkItDown as a content-extraction layer. If you need exact visual layout
or package editing, use the format-specific skill instead of forcing it through
Markdown conversion.
