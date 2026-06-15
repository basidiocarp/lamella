# MarkItDown Example Usage

Practical examples for common MarkItDown workflows. These are intentionally short and complete so they can be copied into real projects without carrying a large handbook around.

## Basic File Conversion

```python
from markitdown import MarkItDown

md = MarkItDown()

result = md.convert("document.pdf")
print(result.text_content[:1000])
```

## Save Converted Markdown

```python
from pathlib import Path
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("slides.pptx")

Path("slides.md").write_text(result.text_content, encoding="utf-8")
```

## Convert from a Stream

```python
from markitdown import MarkItDown

md = MarkItDown()

with open("paper.pdf", "rb") as stream:
    result = md.convert_stream(stream, file_extension=".pdf")
    print(result.text_content[:500])
```

## Batch Conversion

```python
from pathlib import Path
from markitdown import MarkItDown

md = MarkItDown()
input_dir = Path("incoming")
output_dir = Path("converted")
output_dir.mkdir(exist_ok=True)

for path in input_dir.iterdir():
    if path.suffix.lower() not in {".pdf", ".docx", ".pptx", ".xlsx"}:
        continue
    result = md.convert(path)
    target = output_dir / f"{path.stem}.md"
    target.write_text(result.text_content, encoding="utf-8")
    print(f"converted {path.name} -> {target.name}")
```

## AI-Enhanced Image Descriptions

```python
from openai import OpenAI
from markitdown import MarkItDown

client = OpenAI()
md = MarkItDown(
    llm_client=client,
    llm_model="gpt-4.1-mini",
)

result = md.convert("paper_with_figures.pdf")
print(result.text_content)
```

## Research Paper Pipeline

```python
from pathlib import Path
from markitdown import MarkItDown

md = MarkItDown()
papers = Path("papers")
out = Path("markdown")
out.mkdir(exist_ok=True)

for paper in papers.glob("*.pdf"):
    result = md.convert(paper)
    target = out / f"{paper.stem}.md"
    target.write_text(result.text_content, encoding="utf-8")
```

## Safe Conversion Wrapper

```python
import logging
from pathlib import Path
from markitdown import MarkItDown

logging.basicConfig(level=logging.INFO)
md = MarkItDown()

def safe_convert(path: Path) -> bool:
    try:
        result = md.convert(path)
        path.with_suffix(".md").write_text(result.text_content, encoding="utf-8")
        return True
    except Exception as exc:
        logging.exception("failed to convert %s: %s", path, exc)
        return False
```
