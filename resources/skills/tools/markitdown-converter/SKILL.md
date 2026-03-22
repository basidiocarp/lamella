---
name: markitdown-converter
description: >-
  Convert files and office documents to Markdown. Use when extracting text from PDF, DOCX, PPTX, XLSX, images, audio, or other formats
  for LLM processing or documentation.
---

# MarkItDown - File to Markdown Conversion


## Contents

- [Supported Formats](#supported-formats)
- [Quick Start](#quick-start)
- [AI-Enhanced Conversion](#ai-enhanced-conversion)
- [Azure Document Intelligence](#azure-document-intelligence)
- [Optional Dependencies](#optional-dependencies)
- [Error Handling](#error-handling)
- [Large Files](#large-files)
- [Troubleshooting](#troubleshooting)
- [Performance](#performance)
- [References](#references)

Python tool by Microsoft for converting various file formats to Markdown. Token-efficient format for LLM processing.

## Supported Formats

| Format | Notes |
|--------|-------|
| **PDF** | Full text extraction |
| **DOCX** | Tables, formatting preserved |
| **PPTX** | Slides with notes |
| **XLSX** | Tables and data |
| **Images** | EXIF + OCR |
| **Audio** | Metadata + transcription |
| **HTML, CSV, JSON, XML** | Clean conversion |
| **ZIP** | Iterates contents |
| **EPUB** | Full text extraction |
| **YouTube** | Fetch transcriptions |

## Quick Start

### Installation

```bash
pip install 'markitdown[all]'
```

### Command-Line

```bash
# Basic conversion
markitdown document.pdf > output.md

# Specify output
markitdown document.pdf -o output.md

# List plugins
markitdown --list-plugins
```

### Python API

```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("document.pdf")
print(result.text_content)

# From stream
with open("doc.pdf", "rb") as f:
    result = md.convert_stream(f, file_extension=".pdf")
```

## AI-Enhanced Conversion

```python
from markitdown import MarkItDown
from openai import OpenAI

client = OpenAI(
    api_key="your-openrouter-key",
    base_url="https://openrouter.ai/api/v1"
)

md = MarkItDown(
    llm_client=client,
    llm_model="anthropic/claude-opus-4.5",
    llm_prompt="Describe this image in detail"
)

result = md.convert("presentation.pptx")
```

## Azure Document Intelligence

```bash
markitdown document.pdf -o output.md -d -e "<endpoint>"
```

```python
md = MarkItDown(docintel_endpoint="<endpoint>")
result = md.convert("complex.pdf")
```

## Optional Dependencies

```bash
pip install 'markitdown[pdf]'      # PDF only
pip install 'markitdown[docx]'     # Word
pip install 'markitdown[pptx]'     # PowerPoint
pip install 'markitdown[xlsx]'     # Excel
pip install 'markitdown[audio-transcription]'
pip install 'markitdown[youtube-transcription]'
pip install 'markitdown[all]'      # Everything
```

## Error Handling

```python
try:
    result = md.convert("document.pdf")
except FileNotFoundError:
    print("File not found")
except Exception as e:
    print(f"Conversion error: {e}")
```

## Large Files

```python
with open("large.pdf", "rb") as f:
    result = md.convert_stream(f, file_extension=".pdf")
    with open("output.md", "w") as out:
        out.write(result.text_content)
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Missing dependencies | `pip install 'markitdown[pdf]'` |
| Binary file errors | Use `"rb"` mode |
| OCR not working | Install tesseract: `brew install tesseract` |

## Performance

- **PDF**: Large PDFs take time
- **Image OCR**: CPU-intensive
- **Audio transcription**: Compute-heavy
- **AI descriptions**: API costs

## References

- [use-cases.md](references/use-cases.md) - Scientific papers, batch conversion, YouTube
- [advanced-features.md](references/advanced-features.md) - AI enhancement, Azure, Docker, best practices
- [MarkItDown GitHub](https://github.com/microsoft/markitdown)
- [OpenRouter](https://openrouter.ai) - AI-enhanced conversions
### Additional Resources

- [Example Usage](assets/example_usage.md)
- [Api Reference](references/api_reference.md)
- [File Formats](references/file_formats.md)
- [Batch Convert](scripts/batch_convert.py)
- [Convert Literature](scripts/convert_literature.py)
- [Convert With Ai](scripts/convert_with_ai.py)
