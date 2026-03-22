# MarkItDown Use Cases

## 1. Convert Scientific Papers to Markdown

```python
from markitdown import MarkItDown

md = MarkItDown()

# Convert PDF paper
result = md.convert("research_paper.pdf")
with open("paper.md", "w") as f:
    f.write(result.text_content)
```

---

## 2. Extract Data from Excel for Analysis

```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("data.xlsx")

# Result will be in Markdown table format
print(result.text_content)
```

---

## 3. Process Multiple Documents

```python
from markitdown import MarkItDown
import os
from pathlib import Path

md = MarkItDown()
// ... (8 lines trimmed)
    output_file = output_dir / f"{pdf_file.stem}.md"
    output_file.write_text(result.text_content)
    print(f"Converted: {pdf_file.name}")
```

---

## 4. Convert PowerPoint with AI Descriptions

```python
from markitdown import MarkItDown
from openai import OpenAI

# Use OpenRouter for access to multiple AI models
client = OpenAI(
// ... (10 lines trimmed)
result = md.convert("presentation.pptx")
with open("presentation.md", "w") as f:
    f.write(result.text_content)
```

---

## 5. Batch Convert with Different Formats

```python
from markitdown import MarkItDown
from pathlib import Path

md = MarkItDown()

// ... (14 lines trimmed)
        print(f"✓ Converted {file}")
    except Exception as e:
        print(f"✗ Error converting {file}: {e}")
```

---

## 6. Extract YouTube Video Transcription

```python
from markitdown import MarkItDown

md = MarkItDown()

# Convert YouTube video to transcript
result = md.convert("https://www.youtube.com/watch?v=VIDEO_ID")
print(result.text_content)
```

---

## Integration with Scientific Workflows

### Convert Literature for Review

```python
from markitdown import MarkItDown
from pathlib import Path

md = MarkItDown()

// ... (27 lines trimmed)
    llm_model="anthropic/claude-opus-4.5",
    llm_prompt="Describe scientific figures with technical precision"
)
```

### Extract Tables for Analysis

```python
from markitdown import MarkItDown
import re

md = MarkItDown()
result = md.convert("data_tables.xlsx")

# Markdown tables can be parsed or used directly
print(result.text_content)
```
