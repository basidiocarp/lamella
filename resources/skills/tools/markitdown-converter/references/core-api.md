# MarkItDown Core API

Use this reference for the base Python API.

## Create a Converter

```python
from markitdown import MarkItDown

md = MarkItDown(
    llm_client=None,
    llm_model=None,
    llm_prompt=None,
    docintel_endpoint=None,
    enable_plugins=False
)
```

## Convert a File

```python
result = md.convert("document.pdf")
print(result.text_content)
```

## Convert a Stream

```python
with open("document.pdf", "rb") as stream:
    result = md.convert_stream(stream, file_extension=".pdf")
```

Open streams in binary mode.

## Result Object

- `text_content`: converted Markdown
- `title`: extracted title when available
