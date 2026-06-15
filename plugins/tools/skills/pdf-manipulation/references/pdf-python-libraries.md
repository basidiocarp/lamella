# PDF Python Libraries

Use Python libraries when the workflow needs scripting, text extraction, table
recovery, or PDF generation.

## pypdf

Use for simple read, merge, split, rotate, and metadata operations.

```python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("input.pdf")
writer = PdfWriter()

for page in reader.pages:
    writer.add_page(page)

with open("copy.pdf", "wb") as output:
    writer.write(output)
```

## pdfplumber

Use for tables, layout-aware text, and page-level inspection.

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    page = pdf.pages[0]
    text = page.extract_text()
    tables = page.extract_tables()
```

Use `page.within_bbox()` when you need a region-specific extraction.

## pypdfium2

Use for fast rendering or turning pages into images.

```python
import pypdfium2 as pdfium

pdf = pdfium.PdfDocument("document.pdf")
for index, page in enumerate(pdf):
    image = page.render(scale=1.5).to_pil()
    image.save(f"page-{index + 1}.png")
```

## reportlab

Use when creating PDFs from scratch.

```python
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

c = canvas.Canvas("hello.pdf", pagesize=letter)
c.drawString(72, 720, "Hello PDF")
c.save()
```

## Selection Guide

- edit existing pages: `pypdf`
- extract tables or coordinates: `pdfplumber`
- render to images: `pypdfium2`
- generate new PDFs: `reportlab`
