# OOXML Schema and Content Patterns

Use this reference when editing `word/document.xml` directly.

## Schema Rules

- Paragraph property order in `<w:pPr>` should remain stable:
  `<w:pStyle>`, `<w:numPr>`, `<w:spacing>`, `<w:ind>`, `<w:jc>`.
- Add `xml:space="preserve"` when leading or trailing spaces matter.
- If the file is ASCII-oriented, smart punctuation may need entity encoding.

## Core Paragraph Pattern

```xml
<w:p>
  <w:r>
    <w:t>Text content</w:t>
  </w:r>
</w:p>
```

## Headings

```xml
<w:p>
  <w:pPr>
    <w:pStyle w:val="Heading1" />
    <w:jc w:val="left" />
  </w:pPr>
  <w:r>
    <w:t>Section Heading</w:t>
  </w:r>
</w:p>
```

## Lists

```xml
<w:p>
  <w:pPr>
    <w:pStyle w:val="ListParagraph" />
    <w:numPr>
      <w:ilvl w:val="0" />
      <w:numId w:val="1" />
    </w:numPr>
  </w:pPr>
  <w:r>
    <w:t>Bullet item</w:t>
  </w:r>
</w:p>
```

## Tables

```xml
<w:tbl>
  <w:tblPr>
    <w:tblStyle w:val="TableGrid" />
    <w:tblW w:w="0" w:type="auto" />
  </w:tblPr>
  <w:tr>
    <w:tc>
      <w:p>
        <w:r><w:t>Cell content</w:t></w:r>
      </w:p>
    </w:tc>
  </w:tr>
</w:tbl>
```

## Common Layout Elements

- page break: `<w:br w:type="page" />`
- highlight: `<w:highlight w:val="yellow" />`
- underline: `<w:u w:val="single" />`

Keep layout and formatting in explicit run or paragraph properties instead of
relying on implicit defaults when you are patching existing XML.
