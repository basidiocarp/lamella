# DOCX-JS Guide

Use this as the advanced companion to `docx-js.md` when you need page layout,
tables, or TOC behavior.

## Page Size

Set page size explicitly if the document must target US Letter instead of the
library default:

```javascript
properties: {
  page: {
    size: { width: 12240, height: 15840 },
    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
  }
}
```

## Lists

Use real numbering configuration, not unicode bullets inside text runs.

## Tables

Tables render most reliably when the total table width, `columnWidths`, and the
individual cell widths all agree.

## Images

Always provide:

- `type`
- `data`
- explicit `transformation`
- usable alt text

## TOC and Headings

Use `HeadingLevel` on heading paragraphs if the document needs a table of
contents. Avoid mixing TOC-driven headings with ad hoc custom heading behavior.

## Practical Rule

If rendering quality matters, validate a generated file in Word or LibreOffice
before assuming the OOXML is sound.
