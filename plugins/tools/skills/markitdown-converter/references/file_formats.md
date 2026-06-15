# File Format Support

Use this reference to decide whether MarkItDown is a good fit for the source
format.

## Good Fits

- `pdf` for text-heavy reports and papers
- `docx` for structured office documents
- `pptx` for slide text and speaker notes
- `xlsx` and `xls` for tables and sheet data
- common image formats when OCR or description is acceptable

## What Carries Over Well

MarkItDown is strongest at:

- text extraction
- table extraction
- heading hierarchy
- markdown-oriented content preparation for LLM use

## Common Limits

- complex visual layout is not preserved exactly
- scanned files may need OCR-related dependencies
- advanced format-specific features like tracked changes, annotations, and forms
  may need a dedicated format-specific tool instead

## Practical Rule

Choose MarkItDown when the goal is readable extracted content. Choose a
format-specific workflow when exact layout or package semantics matter.
