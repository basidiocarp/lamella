---
name: pdf-manipulation
description: "Extracts, creates, merges, splits, and fills PDF documents."
origin: lamella
---

# PDF Processing Guide

Use this skill when working with PDF extraction, generation, splitting, merging, or forms. Keep the main skill focused on task selection and tool choice; use the references for library- and workflow-specific detail.

## When to Use

- Extracting text, tables, images, or metadata from PDFs
- Creating PDFs from programmatic content
- Splitting, merging, rotating, or encrypting files
- Filling interactive or non-fillable forms

## Tool Selection

| Task | Preferred Tooling |
|------|-------------------|
| basic read, merge, split, rotate | `pypdf` |
| layout-aware text and tables | `pdfplumber` |
| new document generation | `reportlab` |
| shell workflows and repair | `qpdf`, `pdftotext`, `pdftk` |
| form filling | dedicated form references |

## Core Workflow

1. Identify whether the file is text-native, scanned, or form-based.
2. Pick the lightest tool that handles the task.
3. Validate output quality on a representative sample before batching.
4. Treat scanned PDFs and form overlays as separate workflows from standard extraction.
5. Use the focused references when the task crosses into forms, OCR, or troubleshooting.

## Quick Examples

```python
from pypdf import PdfReader

reader = PdfReader("document.pdf")
text = "\n".join(page.extract_text() or "" for page in reader.pages)
print(text[:1000])
```

```shell
pdftotext -layout input.pdf output.txt
qpdf --empty --pages file1.pdf file2.pdf -- merged.pdf
```

```powershell
pdftotext -layout input.pdf output.txt
qpdf --empty --pages file1.pdf file2.pdf -- merged.pdf
```

## References

- [references/reference.md](references/reference.md)
- [references/pdf-python-libraries.md](references/pdf-python-libraries.md)
- [references/pdf-javascript-libraries.md](references/pdf-javascript-libraries.md)
- [references/pdf-cli-tools.md](references/pdf-cli-tools.md)
- [references/pdf-workflows-and-troubleshooting.md](references/pdf-workflows-and-troubleshooting.md)
- [references/forms.md](references/forms.md)
- [references/fill-fillable-forms.md](references/fill-fillable-forms.md)
- [references/fill-non-fillable-forms.md](references/fill-non-fillable-forms.md)
