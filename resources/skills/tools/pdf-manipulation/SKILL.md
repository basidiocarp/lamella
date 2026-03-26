---
name: pdf-manipulation
description: Extracts text and tables from PDFs, creates PDFs, merges or splits documents, and fills forms. Use when users need to extract content from PDFs, create new PDFs, merge or split documents, or fill PDF forms programmatically.
---

# PDF Processing Guide


## Contents

- [Overview](#overview)
- [Visual Enhancement with Scientific Schematics](#visual-enhancement-with-scientific-schematics)
- [Quick Start](#quick-start)
- [Python Libraries](#python-libraries)
  - [pypdf - Basic Operations](#pypdf---basic-operations)
  - [pdfplumber - Text and Table Extraction](#pdfplumber---text-and-table-extraction)
  - [reportlab - Create PDFs](#reportlab---create-pdfs)
- [Command-Line Tools](#command-line-tools)
  - [pdftotext (poppler-utils)](#pdftotext-poppler-utils)
  - [qpdf](#qpdf)
  - [pdftk (if available)](#pdftk-if-available)
- [Common Tasks](#common-tasks)
  - [Extract Text from Scanned PDFs](#extract-text-from-scanned-pdfs)
  - [Add Watermark](#add-watermark)
  - [Extract Images](#extract-images)
  - [Password Protection](#password-protection)
- [Quick Reference](#quick-reference)
- [Next Steps](#next-steps)


## Overview

Extract text/tables, create PDFs, merge/split files, fill forms using Python libraries and command-line tools. Apply this skill for programmatic document processing and analysis. For advanced features or form filling, consult reference.md and forms.md.

## Quick Start

```python
from pypdf import PdfReader, PdfWriter

# Read a PDF
reader = PdfReader("document.pdf")
print(f"Pages: {len(reader.pages)}")

# Extract text
text = ""
for page in reader.pages:
    text += page.extract_text()
```

## Python Libraries

### pypdf - Basic Operations

#### Merge PDFs
```python
from pypdf import PdfWriter, PdfReader

writer = PdfWriter()
for pdf_file in ["doc1.pdf", "doc2.pdf", "doc3.pdf"]:
    reader = PdfReader(pdf_file)
    for page in reader.pages:
        writer.add_page(page)

with open("merged.pdf", "wb") as output:
    writer.write(output)
```

#### Split PDF
```python
reader = PdfReader("input.pdf")
for i, page in enumerate(reader.pages):
    writer = PdfWriter()
    writer.add_page(page)
    with open(f"page_{i+1}.pdf", "wb") as output:
        writer.write(output)
```

#### Extract Metadata
```python
reader = PdfReader("document.pdf")
meta = reader.metadata
print(f"Title: {meta.title}")
print(f"Author: {meta.author}")
print(f"Subject: {meta.subject}")
print(f"Creator: {meta.creator}")
```

#### Rotate Pages
```python
reader = PdfReader("input.pdf")
writer = PdfWriter()

page = reader.pages[0]
page.rotate(90)  # Rotate 90 degrees clockwise
writer.add_page(page)

with open("rotated.pdf", "wb") as output:
    writer.write(output)
```

### pdfplumber - Text and Table Extraction

#### Extract Text with Layout
```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        print(text)
```

#### Extract Tables
```python
with pdfplumber.open("document.pdf") as pdf:
    for i, page in enumerate(pdf.pages):
        tables = page.extract_tables()
        for j, table in enumerate(tables):
            print(f"Table {j+1} on page {i+1}:")
            for row in table:
                print(row)
```

#### Advanced Table Extraction
```python
import pandas as pd

with pdfplumber.open("document.pdf") as pdf:
    all_tables = []
// ... (9 lines trimmed)
    combined_df = pd.concat(all_tables, ignore_index=True)
    combined_df.to_excel("extracted_tables.xlsx", index=False)
```

### reportlab - Create PDFs

#### Basic PDF Creation
```python
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

c = canvas.Canvas("hello.pdf", pagesize=letter)
// ... (9 lines trimmed)
# Save
c.save()
```

#### Create PDF with Multiple Pages
```python
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet

doc = SimpleDocTemplate("report.pdf", pagesize=letter)
// ... (15 lines trimmed)

# Build PDF
doc.build(story)
```

## Command-Line Tools

### pdftotext (poppler-utils)
```bash
# Extract text
pdftotext input.pdf output.txt

# Extract text preserving layout
pdftotext -layout input.pdf output.txt

# Extract specific pages
pdftotext -f 1 -l 5 input.pdf output.txt  # Pages 1-5
```

### qpdf
```bash
# Merge PDFs
qpdf --empty --pages file1.pdf file2.pdf -- merged.pdf

# Split pages
// ... (6 lines trimmed)
# Remove password
qpdf --password=mypassword --decrypt encrypted.pdf decrypted.pdf
```

### pdftk (if available)
```bash
# Merge
pdftk file1.pdf file2.pdf cat output merged.pdf

# Split
pdftk input.pdf burst

# Rotate
pdftk input.pdf rotate 1east output rotated.pdf
```

## Common Tasks

### Extract Text from Scanned PDFs
```python
# Requires: pip install pytesseract pdf2image
import pytesseract
from pdf2image import convert_from_path

// ... (9 lines trimmed)

print(text)
```

### Add Watermark
```python
from pypdf import PdfReader, PdfWriter

# Create watermark (or load existing)
watermark = PdfReader("watermark.pdf").pages[0]
// ... (9 lines trimmed)
with open("watermarked.pdf", "wb") as output:
    writer.write(output)
```

### Extract Images
```bash
# Using pdfimages (poppler-utils)
pdfimages -j input.pdf output_prefix

# This extracts all images as output_prefix-000.jpg, output_prefix-001.jpg, etc.
```

### Password Protection
```python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("input.pdf")
writer = PdfWriter()
// ... (7 lines trimmed)
with open("encrypted.pdf", "wb") as output:
    writer.write(output)
```

## Quick Reference

| Task | Best Tool | Command/Code |
|------|-----------|--------------|
| Merge PDFs | pypdf | `writer.add_page(page)` |
| Split PDFs | pypdf | One page per file |
| Extract text | pdfplumber | `page.extract_text()` |
| Extract tables | pdfplumber | `page.extract_tables()` |
| Create PDFs | reportlab | Canvas or Platypus |
| Command line merge | qpdf | `qpdf --empty --pages ...` |
| OCR scanned PDFs | pytesseract | Convert to image first |
| Fill PDF forms | pdf-lib or pypdf (see forms.md) | See forms.md |

## Next Steps

- For advanced pypdfium2 usage, see reference.md
- For JavaScript libraries (pdf-lib), see reference.md
- If fill out a PDF form, follow the instructions in forms.md
- For troubleshooting guides, see reference.md

## Reference Files


| File | Path |
|------|------|
| [Check Bounding Boxes](scripts/check_bounding_boxes.py) | `scripts/check_bounding_boxes.py` |
| [Check Bounding Boxes Test](scripts/check_bounding_boxes_test.py) | `scripts/check_bounding_boxes_test.py` |
| [Check Fillable Fields](scripts/check_fillable_fields.py) | `scripts/check_fillable_fields.py` |
| [Convert Pdf To Images](scripts/convert_pdf_to_images.py) | `scripts/convert_pdf_to_images.py` |
| [Create Validation Image](scripts/create_validation_image.py) | `scripts/create_validation_image.py` |
| [Extract Form Field Info](scripts/extract_form_field_info.py) | `scripts/extract_form_field_info.py` |
| [Fill Fillable Fields](scripts/fill_fillable_fields.py) | `scripts/fill_fillable_fields.py` |
| [Fill Pdf Form With Annotations](scripts/fill_pdf_form_with_annotations.py) | `scripts/fill_pdf_form_with_annotations.py` |
