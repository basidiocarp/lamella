# DOCX XML Essentials

Use this reference when editing unpacked DOCX XML directly.

## Core Rules

- preserve required child ordering in paragraph and run property blocks
- use `xml:space="preserve"` when text needs leading or trailing whitespace
- keep relationship files, content types, and media references aligned

## Tracked Changes

Use `<w:ins>` for insertions and `<w:del>` with `<w:delText>` for deletions.
Mark only the changed span, not unrelated surrounding text.

## Comments

`<w:commentRangeStart>` and `<w:commentRangeEnd>` belong as siblings of runs,
not nested inside `<w:r>`.

## Images

Image insertion requires all three:

1. media file in `word/media/`
2. relationship in `word/_rels/document.xml.rels`
3. reference from the document XML

## Practical Rule

When editing raw DOCX XML, package integrity matters more than elegance. A
small valid edit is better than a broad change that breaks the document.
