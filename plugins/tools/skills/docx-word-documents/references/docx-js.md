# DOCX Library Essentials

Use this reference when generating `.docx` files with the JavaScript `docx`
library.

## Minimal Setup

```javascript
const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs');

const doc = new Document({
  sections: [{
    children: [
      new Paragraph({
        children: [new TextRun('Hello, Word')]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => fs.writeFileSync('doc.docx', buffer));
```

## Critical Rules

- Use separate `Paragraph` elements for line breaks. Do not rely on `\n`.
- Put `TextRun` objects inside paragraph `children`.
- Use real numbering configuration for lists instead of unicode bullets.
- Put `PageBreak` inside a `Paragraph`, never on its own.
- Set a default document font instead of hand-formatting every run.

## Tables and Images

For tables, set column widths deliberately and apply borders at the cell level
for predictable rendering. For images, always provide the `type` and explicit
dimensions.

## Headings and TOC

If you need a table of contents, use `HeadingLevel` on heading paragraphs and
avoid mixing that with ad hoc custom heading logic.

## Practical Rule

Generate the smallest working document first, then add tables, images, and
styles incrementally. Broken OOXML is much easier to isolate when content is
added in layers.
