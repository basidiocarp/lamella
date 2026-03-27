# PDF Processing Advanced Reference

Use this file as the routing page for advanced PDF work. The high-value details
now live in focused references instead of one large mixed handbook.

## Open These References By Task

1. [pdf-python-libraries.md](./pdf-python-libraries.md)
   Use for `pypdf`, `pdfplumber`, `pypdfium2`, and `reportlab` workflows.
2. [pdf-javascript-libraries.md](./pdf-javascript-libraries.md)
   Use for `pdf-lib` and `pdfjs-dist`.
3. [pdf-cli-tools.md](./pdf-cli-tools.md)
   Use for `pdftotext`, `pdftoppm`, `pdfimages`, and `qpdf`.
4. [pdf-workflows-and-troubleshooting.md](./pdf-workflows-and-troubleshooting.md)
   Use for batch processing, OCR fallback, repair, and performance tactics.

## Tool Selection

- plain text extraction: `pdftotext` or `pypdf`
- structured tables: `pdfplumber`
- image rendering: `pypdfium2`
- JavaScript document edits: `pdf-lib`
- browser rendering and annotation inspection: `pdfjs-dist`
- repair, split, merge, or encryption: `qpdf`

## Practical Rule

Do not try to use one library for every PDF job. Pick the narrowest tool that
matches the task and fall back to OCR only when the document is image-based.
