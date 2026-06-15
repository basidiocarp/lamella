# PDF Workflows and Troubleshooting

Use this reference for end-to-end processing patterns instead of library-level
API lookup.

## Batch Processing Pattern

```python
import glob
import logging
from pypdf import PdfReader

logger = logging.getLogger(__name__)

for pdf_file in glob.glob("input/*.pdf"):
    try:
        reader = PdfReader(pdf_file)
        text = "".join(page.extract_text() or "" for page in reader.pages)
        logger.info("processed %s chars from %s", len(text), pdf_file)
    except Exception as exc:
        logger.error("failed on %s: %s", pdf_file, exc)
```

## Figure Extraction Pattern

- fastest path: `pdfimages -all`
- render path: `pypdfium2` when you need page images or custom detection
- OCR path: only when the source is scanned

## OCR Fallback

```python
import pytesseract
from pdf2image import convert_from_path

def extract_text_with_ocr(pdf_path):
    images = convert_from_path(pdf_path)
    return "".join(pytesseract.image_to_string(image) for image in images)
```

## Common Failures

### Encrypted PDFs

- inspect with `qpdf --show-encryption`
- decrypt only when you have the right password or workflow approval

### Corrupted PDFs

```bash
qpdf --check corrupted.pdf
qpdf --replace-input corrupted.pdf
```

### Performance Issues

- split huge PDFs with `qpdf --split-pages`
- prefer `pdfimages` over full-page rendering for image extraction
- avoid `pypdf.extract_text()` for very large layout-sensitive documents

## Memory Tactics

- process page-by-page, not whole-document copies
- write chunk files when the source is very large
- keep preview renders low resolution until final export
