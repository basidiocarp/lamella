# MarkItDown Example Usage

This document provides practical examples of using MarkItDown in various scenarios.

## Basic Examples

### 1. Simple File Conversion

```python
from markitdown import MarkItDown

md = MarkItDown()

# Convert a PDF
result = md.convert("research_paper.pdf")
print(result.text_content)

# Convert a Word document
result = md.convert("manuscript.docx")
print(result.text_content)

# Convert a PowerPoint
result = md.convert("presentation.pptx")
print(result.text_content)
```

### 2. Save to File

```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("document.pdf")

with open("output.md", "w", encoding="utf-8") as f:
    f.write(result.text_content)
```

### 3. Convert from Stream

```python
from markitdown import MarkItDown

md = MarkItDown()

with open("document.pdf", "rb") as f:
    result = md.convert_stream(f, file_extension=".pdf")
    print(result.text_content)
```

## Scientific Workflows

### Convert Research Papers

```python
from markitdown import MarkItDown
from pathlib import Path

md = MarkItDown()

// ... (10 lines trimmed)
    output_file.write_text(result.text_content)
    
    print(f"Converted: {paper.name}")
```

### Extract Tables from Excel

```python
from markitdown import MarkItDown

md = MarkItDown()

# Convert Excel to Markdown tables
result = md.convert("experimental_data.xlsx")

# The result contains Markdown-formatted tables
print(result.text_content)

# Save for further processing
with open("data_tables.md", "w") as f:
    f.write(result.text_content)
```

### Process Presentation Slides

```python
from markitdown import MarkItDown
from openai import OpenAI

# With AI descriptions for images
client = OpenAI()
// ... (13 lines trimmed)

with open("talk_notes.md", "w") as f:
    f.write(output)
```

## AI-Enhanced Conversions

### Detailed Image Descriptions

```python
from markitdown import MarkItDown
from openai import OpenAI

# Initialize OpenRouter client
client = OpenAI(
// ... (20 lines trimmed)
# Convert paper with figures
result = md.convert("paper_with_figures.pdf")
print(result.text_content)
```

### Different Prompts for Different Files

```python
from markitdown import MarkItDown
from openai import OpenAI

# Initialize OpenRouter client
client = OpenAI(
// ... (18 lines trimmed)
# Use appropriate instance for each file
paper_result = scientific_md.convert("research.pdf")
slides_result = presentation_md.convert("talk.pptx")
```

## Batch Processing

### Process Multiple Files

```python
from markitdown import MarkItDown
from pathlib import Path

md = MarkItDown()

// ... (15 lines trimmed)
        print(f"✓ {file} -> {output}")
    except Exception as e:
        print(f"✗ Error converting {file}: {e}")
```

### Parallel Processing

```python
from markitdown import MarkItDown
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

def convert_file(filepath):
// ... (13 lines trimmed)
    
    for input_file, output_file in results:
        print(f"Converted: {input_file} -> {output_file}")
```

## Integration Examples

### Literature Review Pipeline

```python
from markitdown import MarkItDown
from pathlib import Path
import json

md = MarkItDown()
// ... (23 lines trimmed)
# Save catalog
with open(output_dir / "catalog.json", "w") as f:
    json.dump(catalog, f, indent=2)
```

### Data Extraction Pipeline

```python
from markitdown import MarkItDown
import re

md = MarkItDown()

// ... (20 lines trimmed)
    print(f"Table {i+1}:")
    print(table)
    print("\n" + "="*50 + "\n")
```

### YouTube Transcript Analysis

```python
from markitdown import MarkItDown

md = MarkItDown()

# Get transcript
video_url = "https://www.youtube.com/watch?v=VIDEO_ID"
result = md.convert(video_url)

# Save transcript
with open("lecture_transcript.md", "w") as f:
    f.write(f"# Lecture Transcript\n\n")
    f.write(f"**Source**: {video_url}\n\n")
    f.write(result.text_content)
```

## Error Handling

### Robust Conversion

```python
from markitdown import MarkItDown
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
// ... (30 lines trimmed)
results = [safe_convert(f) for f in files]

print(f"Successfully converted {sum(results)}/{len(files)} files")
```

## Advanced Use Cases

### Custom Metadata Extraction

```python
from markitdown import MarkItDown
import re
from datetime import datetime

md = MarkItDown()
// ... (32 lines trimmed)
# Use it
content, meta = convert_with_metadata("paper.pdf")
print(meta)
```

### Format-Specific Processing

```python
from markitdown import MarkItDown
from pathlib import Path

md = MarkItDown()

// ... (28 lines trimmed)
# Use it
content = process_by_format("presentation.pptx")
print(content)
```

